import { ID } from "react-native-appwrite";
import { appWriteConfig, storage, tablesDB } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await tablesDB.listRows({
        databaseId: appWriteConfig.databaseId,
        tableId: collectionId
    });

    await Promise.all(
        list.rows.map((doc) =>
            tablesDB.deleteRow({
            databaseId: appWriteConfig.databaseId,
            tableId: collectionId,
            rowId: doc.$id
            })
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles({ bucketId:appWriteConfig.bucketId});

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile({bucketId:appWriteConfig.bucketId, fileId:file.$id})
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    const file = await storage.createFile({
        bucketId: appWriteConfig.bucketId,
        fileId: ID.unique(),
        file: fileObj
    });

    return storage.getFileViewURL(appWriteConfig.bucketId, file.$id);
}

async function seed(): Promise<void> {
    // 1. Clear all
    await clearAll(appWriteConfig.categoriesTableId);
    await clearAll(appWriteConfig.customizationsTableId);
    await clearAll(appWriteConfig.menuTableId);
    await clearAll(appWriteConfig.menu_customizationsTableId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await tablesDB.createRow({
                                databaseId: appWriteConfig.databaseId,
                                tableId: appWriteConfig.categoriesTableId,
                                rowId: ID.unique(),
                                data: cat
        });
        categoryMap[cat.name] = doc.$id;
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await tablesDB.createRow({
                                databaseId: appWriteConfig.databaseId,
                                tableId: appWriteConfig.customizationsTableId,
                                rowId: ID.unique(),
                                data: {
                                    name: cus.name,
                                    price: cus.price,
                                    type: cus.type,
                                }
        });
        customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        const uploadedImage = await uploadImageToStorage(item.image_url);
        const doc = await tablesDB.createRow({
                                databaseId: appWriteConfig.databaseId,
                                tableId: appWriteConfig.menuTableId,
                                rowId: ID.unique(),
                                data: {
                                    name: item.name,
                                    description: item.description,
                                    image_url: uploadedImage,
                                    price: item.price,
                                    rating: item.rating,
                                    calories: item.calories,
                                    protein: item.protein,
                                    categories: categoryMap[item.category_name],
                                }
        });

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await tablesDB.createRow({
                                databaseId: appWriteConfig.databaseId,
                                tableId: appWriteConfig.menu_customizationsTableId,
                                rowId: ID.unique(),
                                data: {
                                    menu: doc.$id,
                                    customizations: customizationMap[cusName],
                                }
            });
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;
import * as Y from "yjs";
import { MongoClient } from "mongodb";

export default class CustomPersistence {
  constructor() {
    this.mongoUrl = process.env.MONGODB_URL;
    this.dbName = process.env.MONGODB_DB;
    this.collectionName = process.env.MONGODB_COLLECTION;
    this.ydocTextKey = process.env.YDOC_TEXT_KEY || "tiny-editor";

    if (!this.mongoUrl) {
      throw new Error("缺少必需的环境变量: MONGODB_URL");
    }
    if (!this.dbName) {
      throw new Error("缺少必需的环境变量: MONGODB_DB");
    }
    if (!this.collectionName) {
      throw new Error("缺少必需的环境变量: MONGODB_COLLECTION");
    }

    this.client = new MongoClient(this.mongoUrl);
    this.client.connect();
    this.db = this.client.db(this.dbName);
  }

  async bindState(docName, ydoc) {
    const data = await this.readData(docName);
    if (data) {
      Y.applyUpdate(ydoc, new Uint8Array(data));
    }

    let saveTimeout;
    ydoc.on("update", () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        await this.saveData(docName, ydoc);
      }, 500);
    });
  }

  async writeState(docName, ydoc) {
    await this.saveData(docName, ydoc);
  }

  async readData(docName) {
    const doc = await this.db.collection(this.collectionName).findOne({ docName });
    return doc?.data;
  }

  async saveData(docName, ydoc) {
    await this.db
      .collection(this.collectionName)
      .replaceOne(
        { docName },
        { docName, data: Array.from(Y.encodeStateAsUpdate(ydoc)), text: ydoc.getText(this.ydocTextKey).toString() },
        { upsert: true }
      );
  }

  async close() {
    await this.client.close();
  }
}


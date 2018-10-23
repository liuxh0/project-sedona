import { MongoClient } from 'mongodb';

export class DatabaseUtils {
  private static readonly url = 'mongodb://localhost:27017';

  static async tryConnection(): Promise<boolean> {
    let client: MongoClient | undefined;
    let connectable = false;

    try {
      client = await MongoClient.connect(this.url, { useNewUrlParser: true });
      connectable = true;
    } catch (error) {
      connectable = false
    } finally {
      if (client && client.isConnected) {
        client.close();
      }
    }

    return connectable;
  }
}

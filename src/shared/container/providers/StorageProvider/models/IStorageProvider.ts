export default interface IStorageProvidaer {
    saveFile(file: string): Promise<string>;
    deleteFile(file: string): Promise<void>;
}

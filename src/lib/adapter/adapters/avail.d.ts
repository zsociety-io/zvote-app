import { AleoDeployment, AleoTransaction, BaseMessageSignerWalletAdapter, DecryptPermission, WalletAdapterNetwork, WalletName, WalletReadyState } from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWallet } from '@demox-labs/aleo-wallet-adapter-leo';
export interface AvailWindow extends Window {
    avail?: LeoWallet;
}
export interface AvailWalletAdapterConfig {
    appName?: string;
}
export declare const AvailWalletName: WalletName<"Avail Wallet">;
export declare class AvailWalletAdapter extends BaseMessageSignerWalletAdapter {
    name: WalletName<"Avail Wallet">;
    url: string;
    icon: string;
    readonly supportedTransactionVersions: any;
    private _connecting;
    private _wallet;
    private _publicKey;
    private _decryptPermission;
    private _readyState;
    constructor({ appName }?: AvailWalletAdapterConfig);
    get publicKey(): string;
    get decryptPermission(): string;
    get connecting(): boolean;
    get readyState(): WalletReadyState;
    set readyState(readyState: WalletReadyState);
    decrypt(cipherText: string, tpk?: string, programId?: string, functionName?: string, index?: number): Promise<string>;
    requestRecords(program: string): Promise<any[]>;
    requestTransaction(transaction: AleoTransaction): Promise<string>;
    transactionStatus(transactionId: string): Promise<string>;
    requestRecordPlaintexts(program: string): Promise<any[]>;
    connect(decryptPermission: DecryptPermission, network: WalletAdapterNetwork): Promise<void>;
    disconnect(): Promise<void>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
    requestDeploy(deployment: AleoDeployment): Promise<string>;
    requestExecution(transaction: AleoTransaction): Promise<string>;
    requestBulkTransactions(transactions: AleoTransaction[]): Promise<string[]>;
    getExecution(transactionId: string): Promise<string>;
    requestTransactionHistory(program: string): Promise<any[]>;
}

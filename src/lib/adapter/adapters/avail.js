import { BaseMessageSignerWalletAdapter, DecryptPermission, scopePollingDetectionStrategy, WalletConnectionError, WalletDecryptionError, WalletDecryptionNotAllowedError, WalletDisconnectionError, WalletNotConnectedError, WalletNotReadyError, WalletReadyState, WalletRecordsError, WalletSignTransactionError, WalletTransactionError, } from '@demox-labs/aleo-wallet-adapter-base';
import { connect, decrypt, disconnect, EventStatus, EventType, getAccount, getEvent, getRecords, requestCreateEvent, requestSignature, } from '@puzzlehq/sdk';
//import test from '@puzzlehq/sdk';


export const AvailWalletName = 'Avail Wallet';
export class AvailWalletAdapter extends BaseMessageSignerWalletAdapter {
    name = AvailWalletName;
    url = 'https://avail.global';
    icon = 'https://i.imgur.com/GUkFogY.png';
    supportedTransactionVersions = null;
    _connecting;
    _wallet;
    _publicKey;
    _decryptPermission;
    _readyState = typeof window === 'undefined' || typeof document === 'undefined'
        ? WalletReadyState.Unsupported
        : WalletReadyState.NotDetected;
    constructor({ appName = 'sample' } = {}) {
        super();
        this._connecting = false;
        this._wallet = null;
        this._publicKey = null;
        this._decryptPermission = DecryptPermission.NoDecrypt;
        if (this._readyState !== WalletReadyState.Unsupported) {
            scopePollingDetectionStrategy(() => {
                if (window?.avail) {
                    this._readyState = WalletReadyState.Installed;
                    this.emit('readyStateChange', this._readyState);
                    return true;
                }
                else {
                    // Check if user is on a mobile device
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const isDesktop = /Mac|Windows|Linux/i.test(navigator.userAgent);
                    if (isMobile || isDesktop) {
                        this._readyState = WalletReadyState.Loadable;
                        this.emit('readyStateChange', this._readyState);
                        return true;
                    }
                }
                return false;
            });
        }
    }
    get publicKey() {
        return this._publicKey;
    }
    get decryptPermission() {
        return this._decryptPermission;
    }
    get connecting() {
        return this._connecting;
    }
    get readyState() {
        return this._readyState;
    }
    set readyState(readyState) {
        this._readyState = readyState;
    }
    async decrypt(cipherText, tpk, programId, functionName, index) {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey)
                throw new WalletNotConnectedError();
            switch (this._decryptPermission) {
                case DecryptPermission.NoDecrypt:
                    throw new WalletDecryptionNotAllowedError();
                case DecryptPermission.UponRequest:
                case DecryptPermission.AutoDecrypt:
                case DecryptPermission.OnChainHistory: {
                    try {
                        const text = await decrypt([cipherText]);
                        if (text.error) {
                            throw new Error(text.error);
                        }
                        return text.plaintexts[0];
                    }
                    catch (error) {
                        throw new WalletDecryptionError(error?.message || 'Permission Not Granted', error);
                    }
                }
                default:
                    throw new WalletDecryptionError();
            }
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
    async requestRecords(program) {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey)
                throw new WalletNotConnectedError();
            try {
                const filter = {
                    programIds: [program],
                    status: 'Unspent',
                };
                const result = await getRecords({
                    address: this.publicKey,
                    filter,
                });
                if (result.error) {
                    throw new Error(result.error);
                }
                return result.records.map((record) => {
                    return {
                        ...record,
                        owner: this.publicKey,
                        program_id: program,
                        spent: false,
                    };
                });
            }
            catch (error) {
                throw new WalletRecordsError(error?.message || 'Permission Not Granted', error);
            }
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
    async requestTransaction(transaction) {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey)
                throw new WalletNotConnectedError();
            try {
                const requestData = {
                    type: EventType.Execute,
                    programId: transaction.transitions[0].program,
                    functionId: transaction.transitions[0].functionName,
                    fee: transaction.fee / 1000000,
                    inputs: transaction.transitions[0].inputs,
                };
                const result = await requestCreateEvent(requestData);
                if (result.error) {
                    throw new Error(result.error);
                }
                return result.eventId ? result.eventId : '';
            }
            catch (error) {
                throw new WalletTransactionError(error?.message || 'Permission Not Granted', error);
            }
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
    async transactionStatus(transactionId) {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey)
                throw new WalletNotConnectedError();
            try {
                const result = await getEvent({
                    id: transactionId,
                    address: this.publicKey,
                });
                if (result.error) {
                    throw new Error(result.error);
                }
                return result.event
                    ? result.event.status == EventStatus.Settled
                        ? 'Finalized'
                        : result.event.status
                    : '';
            }
            catch (error) {
                throw new WalletTransactionError(error?.message, error);
            }
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
    async requestRecordPlaintexts(program) {
        return this.requestRecords(program);
    }
    async connect(decryptPermission, network) {
        try {
            if (this.connected || this.connecting)
                return;
            if (this._readyState !== WalletReadyState.Installed &&
                this._readyState !== WalletReadyState.Loadable)
                throw new WalletNotReadyError();
            this._connecting = true;
            try {
                this._wallet = await connect();
                const account = await getAccount();
                if (account.error) {
                    throw new Error(account.error);
                }
                this._publicKey = account.account?.address || null;
                this.emit('connect', this._publicKey?.toString() || '');
            }
            catch (error) {
                throw new WalletConnectionError(error?.message, error);
            }
            this._decryptPermission = decryptPermission;
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
        finally {
            this._connecting = false;
        }
    }
    async disconnect() {
        const wallet = this._wallet;
        if (wallet) {
            // wallet.off('disconnect', this._disconnected);
            this._wallet = null;
            this._publicKey = null;
            try {
                await disconnect();
            }
            catch (error) {
                this.emit('error', new WalletDisconnectionError(error?.message, error));
            }
        }
        this.emit('disconnect');
    }
    async signMessage(message) {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey)
                throw new WalletNotConnectedError();
            try {
                // convert message to string
                const messageString = new TextDecoder().decode(message);
                const signature = await requestSignature({
                    message: messageString,
                    address: this.publicKey,
                });
                if (signature.error) {
                    throw new Error(signature.error);
                }
                // convert signature to Uint8Array
                return new TextEncoder().encode(signature.signature);
            }
            catch (error) {
                throw new WalletSignTransactionError(error?.message || 'Permission Not Granted', error);
            }
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
    requestDeploy(deployment) {
        throw new Error('Method not implemented.');
    }
    requestExecution(transaction) {
        throw new Error('Method not implemented.');
    }
    requestBulkTransactions(transactions) {
        throw new Error('Method not implemented.');
    }
    getExecution(transactionId) {
        throw new Error('Method not implemented.');
    }
    requestTransactionHistory(program) {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=avail.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const chai_1 = require("chai");
const account_1 = require("../../../utils/mock/account");
const account_2 = require("../../../../api/services/account");
const account_3 = require("../../../../api/services/db_service/account");
const account_4 = require("../../../../api/services/account");
const account_5 = require("../../../../api/modules/account");
describe("Services/AccountService", () => {
    describe("Account service class", () => {
        before(() => {
            sinon.restore();
            global["logger"] = {
                err: () => { },
                verbose: () => { },
                info: () => { },
                obj: () => { },
            };
        });
        describe("#getAccount", () => {
            let result;
            let error = null;
            let getAccount_stub;
            before(() => {
                sinon.restore();
                getAccount_stub = sinon.stub(account_3.AccountDBService.prototype, "getAccount");
            });
            context("success when receiving valid id", () => {
                before(async () => {
                    try {
                        getAccount_stub.resolves(account_1.default.account.valid);
                        result = await account_2.default.getAccount("cor_123", (account_1.default.account.valid.id));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should return valid account", () => {
                    (0, chai_1.expect)(result).to.equal(account_1.default.account.valid);
                });
            });
            context("fails when id is invalid", () => {
                before(async () => {
                    try {
                        getAccount_stub.throws(new Error("INVALID_ACCOUNT_ID"));
                        result = await account_2.default.getAccount("cor_123", (account_1.default.account.valid.id));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should throw INVALID_ACCOUNT_ID", () => {
                    (0, chai_1.expect)(error.message).to.equal("INVALID_ACCOUNT_ID");
                });
            });
        });
        describe("#deleteAccount", () => {
            let result;
            let error = null;
            let getAccount_stub, deleteAccount_stub;
            before(() => {
                sinon.restore();
                getAccount_stub = sinon.stub(account_4.AccountService.prototype, "getAccount");
                deleteAccount_stub = sinon.stub(account_3.AccountDBService.prototype, "deleteAccount");
            });
            context("success when receiving valid id", () => {
                before(async () => {
                    try {
                        getAccount_stub.resolves();
                        deleteAccount_stub.resolves(account_1.default.account.deleted);
                        result = await account_2.default.deleteAccount("cor_123", account_1.default.account.deleted.id);
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should return valid account", () => {
                    (0, chai_1.expect)(result).to.equal(account_1.default.account.deleted);
                });
            });
            context("fails when id is invalid", () => {
                before(async () => {
                    try {
                        getAccount_stub.throws(new Error("INVALID_ACCOUNT_ID"));
                        result = await account_2.default.deleteAccount("cor_123", account_1.default.account.deleted.id);
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should throw INVALID_ACCOUNT_ID", () => {
                    (0, chai_1.expect)(error.message).to.equal("INVALID_ACCOUNT_ID");
                });
            });
        });
        describe("#updateAccount", () => {
            let result;
            let error = null;
            let getAccount_stub, updateAccount_stub, validateAccount_stub;
            let fields_to_update, updated_account;
            before(() => {
                sinon.restore();
                validateAccount_stub = sinon.stub(account_5.Account.prototype, "validateAccount");
                getAccount_stub = sinon.stub(account_4.AccountService.prototype, "getAccount");
                updateAccount_stub = sinon.stub(account_3.AccountDBService.prototype, "updateAccount");
            });
            context("success when receiving account id", () => {
                before(async () => {
                    try {
                        fields_to_update = { name: "Lior" };
                        updated_account = { ...account_1.default.account.valid, ...fields_to_update };
                        validateAccount_stub.resolves();
                        getAccount_stub.resolves();
                        updateAccount_stub.resolves(updated_account);
                        result = await account_2.default.updateAccount("cor_123", new account_5.Account(account_1.default.account.valid));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should return valid account", () => {
                    (0, chai_1.expect)(result).to.equal(updated_account);
                });
            });
            context("fails when id is invalid", () => {
                before(async () => {
                    try {
                        fields_to_update = { name: "Lior" };
                        updated_account = { ...account_1.default.account.valid, ...fields_to_update };
                        validateAccount_stub.resolves();
                        getAccount_stub.throws(new Error("INVALID_ACCOUNT_ID"));
                        updateAccount_stub.resolves(updated_account);
                        result = await account_2.default.updateAccount("cor_123", new account_5.Account(account_1.default.account.valid));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should throw INVALID_ACCOUNT_ID", () => {
                    (0, chai_1.expect)(error.message).to.equal("INVALID_ACCOUNT_ID");
                });
            });
        });
        describe("#createAccount", () => {
            let result;
            let error = null;
            let validateCreateAccount_stub, createAccount_stub;
            before(() => {
                sinon.restore();
                validateCreateAccount_stub = sinon.stub(account_4.AccountService.prototype, "validateCreateAccount");
                createAccount_stub = sinon.stub(account_3.AccountDBService.prototype, "createAccount");
            });
            context("success when receiving valid account", () => {
                before(async () => {
                    try {
                        validateCreateAccount_stub.resolves();
                        createAccount_stub.resolves(account_1.default.account.valid);
                        result = await account_2.default.createAccount("cor_123", new account_5.Account(account_1.default.account.valid));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should return valid account", () => {
                    (0, chai_1.expect)(result).to.equal(account_1.default.account.valid);
                });
            });
            context("fails when account has invalid field", () => {
                before(async () => {
                    try {
                        validateCreateAccount_stub.throws(new Error("ACCOUNT_NAME_NOT_INSERTED"));
                        createAccount_stub.resolves(account_1.default.account.valid);
                        result = await account_2.default.createAccount("cor_123", new account_5.Account(account_1.default.account.valid));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should throw ACCOUNT_NAME_NOT_INSERTED", () => {
                    (0, chai_1.expect)(error.message).to.equal("ACCOUNT_NAME_NOT_INSERTED");
                });
            });
        });
        describe("#deleteAccount", () => {
            let result;
            let error = null;
            let validateCreateAccount_stub, createAccount_stub;
            before(() => {
                sinon.restore();
                validateCreateAccount_stub = sinon.stub(account_4.AccountService.prototype, "validateCreateAccount");
                createAccount_stub = sinon.stub(account_3.AccountDBService.prototype, "createAccount");
            });
            context("success when receiving valid account", () => {
                before(async () => {
                    try {
                        validateCreateAccount_stub.resolves();
                        createAccount_stub.resolves(account_1.default.account.valid);
                        result = await account_2.default.createAccount("cor_123", new account_5.Account(account_1.default.account.valid));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should return valid account", () => {
                    (0, chai_1.expect)(result).to.equal(account_1.default.account.valid);
                });
            });
            context("fails when account has invalid field", () => {
                before(async () => {
                    try {
                        validateCreateAccount_stub.throws(new Error("ACCOUNT_NAME_NOT_INSERTED"));
                        createAccount_stub.resolves(account_1.default.account.valid);
                        result = await account_2.default.createAccount("cor_123", new account_5.Account(account_1.default.account.valid));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should throw ACCOUNT_NAME_NOT_INSERTED", () => {
                    (0, chai_1.expect)(error.message).to.equal("ACCOUNT_NAME_NOT_INSERTED");
                });
            });
        });
        describe("#validateCreateAccount", () => {
            let validateAccount_stub;
            let result, error;
            before(() => {
                sinon.restore();
                validateAccount_stub = sinon.stub(account_5.Account.prototype, "validateAccount");
            });
            context("success when receiving valid account", () => {
                before(async () => {
                    try {
                        validateAccount_stub.resolves();
                        await account_2.default["validateCreateAccount"]("cor_123", new account_5.Account(account_1.default.account.valid));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should return valid account", () => {
                    (0, chai_1.expect)(error).to.be.undefined;
                });
            });
            context("fail when not receiving account name", () => {
                const account = JSON.parse(JSON.stringify(account_1.default.account.valid));
                delete account.name;
                before(async () => {
                    try {
                        validateAccount_stub.resolves();
                        await account_2.default["validateCreateAccount"]("cor_123", account);
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should throw ACCOUNT_NAME_NOT_INSERTED", () => {
                    (0, chai_1.expect)(error.message).to.equal("ACCOUNT_NAME_NOT_INSERTED");
                });
            });
            context("fail when not receiving account email", () => {
                const account = JSON.parse(JSON.stringify(account_1.default.account.valid));
                delete account.email;
                before(async () => {
                    try {
                        validateAccount_stub.resolves();
                        await account_2.default["validateCreateAccount"]("cor_123", account);
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should throw ACCOUNT_EMAIL_NOT_INSERTED", () => {
                    (0, chai_1.expect)(error.message).to.equal("ACCOUNT_EMAIL_NOT_INSERTED");
                });
            });
            context("fail when validateAccount throws error", () => {
                const account = JSON.parse(JSON.stringify(account_1.default.account.valid));
                before(async () => {
                    try {
                        validateAccount_stub.throws(new Error('INVALID_EMAIL'));
                        await account_2.default["validateCreateAccount"]("cor_123", new account_5.Account(account));
                    }
                    catch (err) {
                        error = err;
                    }
                });
                it("should throw INVALID_EMAIL", () => {
                    (0, chai_1.expect)(error.message).to.equal("INVALID_EMAIL");
                });
            });
        });
    });
});
//# sourceMappingURL=account.test.js.map
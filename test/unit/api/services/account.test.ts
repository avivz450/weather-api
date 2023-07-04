import * as sinon from "sinon";
import {expect} from "chai";
import MOCK_DATA from "../../../utils/mock/account";
import {accountService} from "../../../../api/services/account"
import { AccountDBService } from "../../../../api/services/db_service/account";
import { AccountService } from "../../../../api/services/account";
import { Account } from "../../../../api/modules/account";

describe("Services/AccountService", () => {
    describe("Account service class", () => {
        before(() => {
            sinon.restore()
            global["logger"] = {
                err: () => {},
                verbose: () => {},
                info: () => {},
                obj: () => {},
            };
        });
        describe("#getAccount", () => {
            let result;
            let error = null;
            let getAccount_stub;

            before(() => {
                sinon.restore();
                getAccount_stub = sinon.stub(AccountDBService.prototype, "getAccount");
            });

            context("success when receiving valid id", () => {
                before(async () => {
                    try {
                        getAccount_stub.resolves(MOCK_DATA.account.valid as Account);
                        result = await accountService.getAccount("cor_123", (MOCK_DATA.account.valid.id));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should return valid account", () => {
                    expect(result).to.equal(MOCK_DATA.account.valid);
                });
            });

            context("fails when id is invalid", () => {
                before(async () => {
                    try {
                        getAccount_stub.throws(new Error("INVALID_ACCOUNT_ID"));
                        result = await accountService.getAccount("cor_123", (MOCK_DATA.account.valid.id));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should throw INVALID_ACCOUNT_ID", () => {
                    expect(error.message).to.equal("INVALID_ACCOUNT_ID");
                });
            });
        });

        describe("#deleteAccount", () => {
            let result;
            let error = null;
            let getAccount_stub, deleteAccount_stub;

            before(() => {
                sinon.restore()
                getAccount_stub = sinon.stub(AccountService.prototype, "getAccount");
                deleteAccount_stub = sinon.stub(AccountDBService.prototype, "deleteAccount");
            });

            context("success when receiving valid id", () => {
                before(async () => {
                    try {
                        getAccount_stub.resolves();
                        deleteAccount_stub.resolves(MOCK_DATA.account.deleted as Account);
                        result = await accountService.deleteAccount("cor_123", MOCK_DATA.account.deleted.id);
                    } catch (err) {
                        error = err;
                    }
                });

                it("should return valid account", () => {
                    expect(result).to.equal(MOCK_DATA.account.deleted);
                });
            });

            context("fails when id is invalid", () => {
                before(async () => {
                    try {
                        deleteAccount_stub.throws(new Error("INVALID_ACCOUNT_ID"));
                        result = await accountService.deleteAccount("cor_123", MOCK_DATA.account.deleted.id);
                    } catch (err) {
                        error = err;
                    }
                });

                it("should throw INVALID_ACCOUNT_ID", () => {
                    expect(error.message).to.equal("INVALID_ACCOUNT_ID");
                });
            });
        });

        describe("#updateAccount", () => {
            let result;
            let error = null;
            let getAccount_stub, updateAccount_stub, validateAccount_stub;
            let fields_to_update, updated_account;

            before(() => {
                sinon.restore()
                validateAccount_stub = sinon.stub(Account.prototype, "validateAccount")
                getAccount_stub = sinon.stub(AccountService.prototype, "getAccount");
                updateAccount_stub = sinon.stub(AccountDBService.prototype, "updateAccount");
            });

            context("success when receiving account id", () => {
                before(async () => {
                    try {
                        fields_to_update = {name: "Lior"};
                        updated_account = {...MOCK_DATA.account.valid, ...fields_to_update};
                        validateAccount_stub.resolves();
                        getAccount_stub.resolves();
                        updateAccount_stub.resolves(updated_account);
                        result = await accountService.updateAccount("cor_123", new Account(MOCK_DATA.account.valid as Account));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should return valid account", () => {
                    expect(result).to.equal(updated_account);
                });
            });

            context("fails when id is invalid", () => {
                before(async () => {
                    try {
                        fields_to_update = {name: "Lior"};
                        updated_account = {...MOCK_DATA.account.valid, ...fields_to_update};
                        validateAccount_stub.resolves();
                        updateAccount_stub.throws(new Error("INVALID_ACCOUNT_ID"));
                        result = await accountService.updateAccount("cor_123", new Account(MOCK_DATA.account.valid as Account));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should throw INVALID_ACCOUNT_ID", () => {
                    expect(error.message).to.equal("INVALID_ACCOUNT_ID");
                });
            });
        });

        describe("#createAccount", () => {
            let result;
            let error = null;
            let validateCreateAccount_stub, createAccount_stub;

            before(() => {
                sinon.restore()
                validateCreateAccount_stub = sinon.stub(AccountService.prototype, <any>"validateCreateAccount")
                createAccount_stub = sinon.stub(AccountDBService.prototype, "createAccount");
            });

            context("success when receiving valid account", () => {
                before(async () => {
                    try {
                        validateCreateAccount_stub.resolves();
                        createAccount_stub.resolves(MOCK_DATA.account.valid);
                        result = await accountService.createAccount("cor_123", new Account(MOCK_DATA.account.valid as Account));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should return valid account", () => {
                    expect(result).to.equal(MOCK_DATA.account.valid);
                });
            });

            context("fails when account has invalid field", () => {
                before(async () => {
                    try {
                        validateCreateAccount_stub.throws(new Error("ACCOUNT_NAME_NOT_INSERTED"));
                        createAccount_stub.resolves(MOCK_DATA.account.valid);
                        result = await accountService.createAccount("cor_123", new Account(MOCK_DATA.account.valid as Account));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should throw ACCOUNT_NAME_NOT_INSERTED", () => {
                    expect(error.message).to.equal("ACCOUNT_NAME_NOT_INSERTED");
                });
            });
        });

        describe("#deleteAccount", () => {
            let result;
            let error = null;
            let validateCreateAccount_stub, createAccount_stub;

            before(() => {
                sinon.restore()
                validateCreateAccount_stub = sinon.stub(AccountService.prototype, <any>"validateCreateAccount")
                createAccount_stub = sinon.stub(AccountDBService.prototype, "createAccount");
            });

            context("success when receiving valid account", () => {
                before(async () => {
                    try {
                        validateCreateAccount_stub.resolves();
                        createAccount_stub.resolves(MOCK_DATA.account.valid);
                        result = await accountService.createAccount("cor_123", new Account(MOCK_DATA.account.valid as Account));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should return valid account", () => {
                    expect(result).to.equal(MOCK_DATA.account.valid);
                });
            });

            context("fails when account has invalid field", () => {
                before(async () => {
                    try {
                        validateCreateAccount_stub.throws(new Error("ACCOUNT_NAME_NOT_INSERTED"));
                        createAccount_stub.resolves(MOCK_DATA.account.valid);
                        result = await accountService.createAccount("cor_123", new Account(MOCK_DATA.account.valid as Account));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should throw ACCOUNT_NAME_NOT_INSERTED", () => {
                    expect(error.message).to.equal("ACCOUNT_NAME_NOT_INSERTED");
                });
            });
        });

        describe("#validateCreateAccount", () => {
            let validateAccount_stub;
            let result, error;

            before(() => {
                sinon.restore()
                validateAccount_stub = sinon.stub(Account.prototype, "validateAccount")
            });

            context("success when receiving valid account", () => {
                before(async () => {
                    try {
                        validateAccount_stub.resolves();
                        await accountService["validateCreateAccount"]("cor_123", new Account(MOCK_DATA.account.valid as Account));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should return valid account", () => {
                    expect(error).to.be.undefined;
                });
            })

            context("fail when not receiving account name", () => {
                const account = JSON.parse(JSON.stringify(MOCK_DATA.account.valid as Account));
                delete account.name

                before(async () => {
                    try {
                        validateAccount_stub.resolves();
                        await accountService["validateCreateAccount"]("cor_123", account);
                    } catch (err) {
                        error = err;
                    }
                });

                it("should throw MISSING_ACCOUNT_NAME", () => {
                    expect(error.message).to.equal("MISSING_ACCOUNT_NAME");
                });
            });

            context("fail when not receiving account email", () => {
                const account = JSON.parse(JSON.stringify(MOCK_DATA.account.valid as Account));
                delete account.email

                before(async () => {
                    try {
                        validateAccount_stub.resolves();
                        await accountService["validateCreateAccount"]("cor_123", account);
                    } catch (err) {
                        error = err;
                    }
                });

                it("should throw MISSING_ACCOUNT_EMAIL", () => {
                    expect(error.message).to.equal("MISSING_ACCOUNT_EMAIL");
                });
            });

            context("fail when validateAccount throws error", () => {
                const account = JSON.parse(JSON.stringify(MOCK_DATA.account.valid as Account));

                before(async () => {
                    try {
                        validateAccount_stub.throws(new Error('INVALID_EMAIL'));
                        await accountService["validateCreateAccount"]("cor_123", new Account(account));
                    } catch (err) {
                        error = err;
                    }
                });

                it("should throw INVALID_EMAIL", () => {
                    expect(error.message).to.equal("INVALID_EMAIL");
                });
            });


        });
    });
});
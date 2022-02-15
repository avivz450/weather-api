import { expect } from "chai";
import sinon from "sinon";
import accountRepository from "../../src/repositories/account.repository.js";
import accountService from "../../src/services/account.service.js";
import { AccountStatuses } from "../../src/types/account.types.js";

describe('#account service module', function () {
    context('changeStatusAccountsByAccountIds', function () {
  
      const status = "active";
      const res_status =AccountStatuses.active
      const accounts_ids=["1"];
      const result_accounts= [{account_id:"1",status: "active"}]
      this.afterEach(() => {
        // Restore the default sandbox here
        sinon.restore();
      });
  
      it('should exists', () => {
        // @ts-ignore
        expect(accountService.changeStatusAccountsByAccountIds).to.be.a('function');
      });
  
      it('success- change all status accounts', async () => {
        sinon.stub(accountRepository, 'changeAccountsStatusesByAccountIds').resolves(res_status);
        expect(await accountService.changeStatusAccountsByAccountIds(status,accounts_ids )).to.deep.equal(result_accounts);
      });
  
    });
  

  });
  
import {getInstance} from "../test-helpers";

describe('Member', () => {
    it('should get member data', async () => {
        const instance = await getInstance();

        const thisMember = await instance.member.getMemberLoggedIn();
        expect(thisMember).not.toBeNull();

        const anotherMember = await instance.member.getMemberById({id: 666});

        expect(anotherMember).not.toBeNull();
    });
});
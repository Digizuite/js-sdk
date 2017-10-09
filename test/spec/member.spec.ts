import {getInstance} from "../test-helpers";

describe('Member', () => {
    it('should get member data', async () => {
        const instance = await getInstance();

        const thisMember = await instance.member.getMemberLoggedIn();
        expect(thisMember).not.toBeNull();

        const anotherMember = await instance.member.getMemberById({id: 666});

        expect(anotherMember).not.toBeNull();
    });

    it('should check if a member has a role', async () => {
        const instance = await getInstance();

        const thisMember = await instance.member.getMemberLoggedIn();
        expect(thisMember.hasRole('Editor_Portal')).toBe(true);
        expect(thisMember.hasRole('foobar-baz')).toBe(false);
    });
});
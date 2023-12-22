import NDKBadgeDefinition from "./NDKBadgeDefinition";
import { NDKUser } from "../../../user/index.js";
import { NDK } from "../../../ndk";
import NDKBadgeAward from "./NDKBadgeAward";

describe("NDKBadgeDefinition", () => {
    let ndk: NDK;
    let badgedefinition: NDKBadgeDefinition;
    let user1: NDKUser;

    beforeEach(() => {
        ndk = new NDK();
        user1 = new NDKUser({
            npub: "npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft",
        });
        badgedefinition = new NDKBadgeDefinition(ndk);
        badgedefinition.author = user1;
    });

    describe("tag names", () => {
        it("should match NIP58 tag names", () => {
            badgedefinition.setReplaceableDTag("123abc");
            badgedefinition.name = "My Badge";
            badgedefinition.description = "My badge description";
            badgedefinition.image = "https://domain.com/image.png";
            badgedefinition.addThumb("https://domain.com/thumb.png");

            expect(badgedefinition.tagValue("name")).toEqual("My Badge");
            expect(badgedefinition.tagValue("description")).toEqual("My badge description");
            expect(badgedefinition.tagValue("image")).toEqual("https://domain.com/image.png");
            expect(badgedefinition.tagValue("thumb")).toEqual("https://domain.com/thumb.png");
        });
    });

    describe("value set by setReplaceableDTag", () => {
        it("can be retrieved by NDKEvent.replaceableDTag", () => {
            badgedefinition.setReplaceableDTag("abc123");
            expect(badgedefinition.replaceableDTag()).toEqual("abc123");
        });
    });

    describe("image", () => {
        it("can be set by just url", () => {
            badgedefinition.image = "https://domain.com/image.png";
            expect(badgedefinition.image?.url).toEqual("https://domain.com/image.png");
        });

        it("can be set by object", () => {
            badgedefinition.image = {
                url: "https://domain.com/image.png",
                dimensions: "1024x1024",
            };
            expect(badgedefinition.image?.url).toEqual("https://domain.com/image.png");
            expect(badgedefinition.image?.dimensions).toEqual("1024x1024");
        });

        it("can be removed by setting as undefined", () => {
            badgedefinition.image = undefined;
            expect(badgedefinition.image).toEqual(undefined);
        });
    });

    describe("thumbs", () => {
        it("can be added by string", () => {
            badgedefinition.addThumb("https://domain.com/thumb.png");
            expect(badgedefinition.getThumbs()[0].url).toEqual("https://domain.com/thumb.png");
        });

        it("can have multiple values", () => {
            badgedefinition.addThumb({
                url: "https://domain.com/thumb_128x128.png",
                dimensions: "128x128",
            });
            badgedefinition.addThumb({
                url: "https://domain.com/thumb_256x256.png",
                dimensions: "256x256",
            });
            expect(badgedefinition.getThumbs().length).toEqual(2);
            expect(badgedefinition.getThumbs()[0].dimensions).toEqual("128x128");
        });

        it("replaces url for existing tags with same dimension", () => {
            badgedefinition.addThumb({
                url: "https://domain.com/thumb_128x128.png",
                dimensions: "128x128",
            });
            badgedefinition.addThumb({
                url: "https://domain.com/thumb_256x256.png",
                dimensions: "256x256",
            });
            badgedefinition.addThumb({
                url: "https://domain.com/newthumb_256x256.png",
                dimensions: "256x256",
            });
            expect(badgedefinition.getThumbs().length).toEqual(2);
            expect(badgedefinition.getThumbs()[1].url).toEqual(
                "https://domain.com/newthumb_256x256.png"
            );
        });
    });
});

describe("NDKBadgeAward", () => {
    let ndk: NDK;
    let badgeaward: NDKBadgeAward;
    let user1: NDKUser;

    beforeEach(() => {
        ndk = new NDK();
        user1 = new NDKUser({
            npub: "npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft",
        });
        badgeaward = new NDKBadgeAward(ndk);
        badgeaward.author = user1;
    });

    describe("tags", () => {
        it('should support "a" tag', () => {
            badgeaward.aTag = "30009:alice:bravery";
            expect(badgeaward.tagValue("a")).toEqual("30009:alice:bravery");
        });
        it("should support multiple p tags", () => {
            badgeaward.pTags = ["pubkey1"];
            badgeaward.pTags = ["pubkey2", "pubkey3", "pubkey4"];
            expect(badgeaward.getMatchingTags("p").length).toEqual(3);
            expect(badgeaward.getMatchingTags("p")[1][1]).toEqual("pubkey3");
        });
    });
});

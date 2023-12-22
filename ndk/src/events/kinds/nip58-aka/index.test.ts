import AKABadgeDefinition from "./AKABadgeDefinition";

import { NDKUser } from "../../../user/index.js";
import { NDK } from "../../../ndk";

describe("AKABadgeDefinition", () => {
    let ndk: NDK;
    let badgedefinition: AKABadgeDefinition;
    let user1: NDKUser;

    beforeEach(() => {
        ndk = new NDK();
        user1 = new NDKUser({
            npub: "npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft",
        });
        badgedefinition = new AKABadgeDefinition(ndk);
        badgedefinition.author = user1;
    });

    describe("applyURL", () => {
        it("should work", () => {
            badgedefinition.applyURL = "https://mydomain.com/apply";

            expect(badgedefinition.tagValue("applyURL")).toEqual("https://mydomain.com/apply");
        });
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

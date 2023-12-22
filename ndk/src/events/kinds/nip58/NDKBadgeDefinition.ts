import type { NDK } from "../../../ndk/index.js";
import { ContentTag } from "../../content-tagger.js";
import { NDKEvent, type NostrEvent } from "../../index.js";
import type { NDKTag } from "../../index.js";
import { NDKKind } from "../index.js";

interface NDKBadgeDefinitionImage {
    url: string; // URL of a high-resolution image representing the badge
    dimensions?: string; // dimensions of the image as <width>x<height> in pixels. "1024x1024" recommmended
}

// converts tag to image
function tagToImage(tag: NDKTag) {
    if (tag.length == 0) return undefined;
    const image: NDKBadgeDefinitionImage = {
        url: tag[1],
    };
    if (tag.length >= 2) image.dimensions = tag[2];
    return image;
}

// converts image to tag
function imageToTag(tagName: string, image: NDKBadgeDefinitionImage | string) {
    const tag: NDKTag = [tagName];

    if (typeof image === "string") {
        tag.push(image);
        return tag;
    }

    if (image?.url) {
        tag.push(image.url);
        if (image.dimensions) tag.push(image.dimensions);
        return tag;
    }

    return undefined;
}

/**
 * Represents a NIP-58 Badge Definition.
 */
export class NDKBadgeDefinition extends NDKEvent {
    constructor(ndk: NDK | undefined, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
        this.kind ??= NDKKind.BadgeDefinition;
    }

    /**
     * Creates a NDKBadgeDefinition from an existing NDKEvent.
     *
     * @param event NDKEvent to create the NDKBadgeDefinition from.
     * @returns NDKBadgeDefinition
     */
    static from(event: NDKEvent) {
        return new NDKBadgeDefinition(event.ndk, event.rawEvent());
    }

    /**
     * Setter for the replaceable "d" tag.
     * Implemented as a function (instead of accessor) to match function NDKEvent.replaceableDTag()
     * If left undefined, NDKEvent.generateTags() will set with random value before signing
     * @param {string | undefined} replaceableDTag - The "d" tag value.
     */
    setReplaceableDTag(replaceableDTag: string | undefined) {
        this.removeTag("d");

        if (replaceableDTag) this.tags.push(["d", replaceableDTag]);
    }

    /**
     * Getter for the short name for the badge.
     *
     * @returns {string | undefined} - The badge short name if available, otherwise undefined.
     */
    get name(): string | undefined {
        return this.tagValue("name");
    }

    /**
     * Setter for the badge name.
     *
     * @param {string | undefined} name - The badge short name to set for the badge.
     */
    set name(name: string | undefined) {
        this.removeTag("name");

        if (name) this.tags.push(["name", name]);
    }

    /**
     * Getter for the badge description.
     *
     * @returns {string | undefined} - The badge description if available, otherwise undefined.
     */
    get description(): string | undefined {
        return this.tagValue("description");
    }

    /**
     * Setter for the badge description.
     *
     * @param {string | undefined} description - The badge description to set for the badge.
     */
    set description(description: string | undefined) {
        this.removeTag("description");

        if (description) this.tags.push(["description", description]);
    }

    /**
     * Getter for the badge image.
     *
     * @returns {NDKBadgeDefinitionImageTag | undefined} - The image if available, otherwise undefined.
     */
    get image(): NDKBadgeDefinitionImage | undefined {
        const tags = this.getMatchingTags("image");
        if (tags.length == 0) return undefined;

        return tagToImage(tags[0]);
    }

    /**
     * Setter for the badge image.
     *
     * @param image - The image to set for the badge. If undefined, tag removed.
     */
    set image(image: NDKBadgeDefinitionImage | string | undefined) {
        this.removeTag("image");
        if (typeof image === "string") {
            this.tags.push(["image", image]);
            return;
        }
        if (image) {
            const tag = imageToTag("image", image);
            if (tag !== undefined) this.tags.push(tag);
        }
    }

    /**
     * Returns all badge thumbs
     *
     * @returns {NDKBadgeDefinitionImageTag[]} - The thumbs if available, empty array if none.
     */
    getThumbs(): NDKBadgeDefinitionImage[] {
        const thumbs: NDKBadgeDefinitionImage[] = [];
        const tags = this.getMatchingTags("thumb");
        tags.forEach((tag) => {
            const image = tagToImage(tag);
            if (image) thumbs.push(image);
        });
        return thumbs;
    }

    /**
     * Adds a thumbnail image. If thumb exists with dimensions, url is updated.
     *
     * @param image - Image oject with url and dimensions, or string of url.
     */
    addThumb(image: NDKBadgeDefinitionImage | string) {
        let url = "";
        let dimensions: string | undefined = undefined;

        if (typeof image === "string") url = image;

        if (typeof image === "object") {
            url = image.url;
            dimensions = image.dimensions;
        }

        if (dimensions) {
            // delete all "thumb" with same dimensions
            this.tags = this.tags.filter(
                (tag) =>
                    tag[0] !== "thumb" ||
                    (tag[0] === "thumb" && tag.length > 2 && tag[2] != dimensions)
            );
            this.tags.push(["thumb", url, dimensions]);
        } else {
            // delete all "thumb" with no dimension
            this.tags = this.tags.filter(
                (tag) => tag[0] !== "thumb" || (tag[0] === "thumb" && tag.length > 2)
            );
            this.tags.push(["thumb", url]);
        }
    }
}

export default NDKBadgeDefinition;

import type { NDK } from "../../../ndk/index.js";
import { NDKEvent, type NostrEvent } from "../../index.js";
import { NDKKind } from "../index.js";

/**
 * Represents a NIP-58 Badge Award.
 */
export class NDKBadgeAward extends NDKEvent {
    constructor(ndk: NDK | undefined, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
        this.kind ??= NDKKind.BadgeAward;
    }

    /**
     * Creates a NDKBadgeAward from an existing NDKEvent.
     *
     * @param event NDKEvent to create the NDKBadgeAward from.
     * @returns NDKBadgeAward
     */
    static from(event: NDKEvent) {
        return new NDKBadgeAward(event.ndk, event.rawEvent());
    }

    /**
     * Getter for the "a" tag, which references the badge being awarded.
     *
     * @returns {string | undefined} - The "a" tag if available, otherwise undefined.
     */
    get aTag(): string | undefined {
        return this.tagValue("a");
    }

    /**
     * Setter for the "a" tag, to reference the badge being awarded..
     *
     * @param {string } aTag - value for "a" tag badge reference.
     */
    set aTag(aTag: string) {
        this.removeTag("a");
        this.tags.push(["a", aTag]);
    }

    /**
     * Getter for "p" tags, the pubkeys of badge awardees.
     *
     * @returns {string[]} - Gets list of pubkeys ob badge awardees, empty list if none.
     */
    get pTags(): string[] {
        const pubkeys: string[] = [];
        const tags = this.getMatchingTags("p");
        tags.forEach((tag) => {
            pubkeys.push(tag[1]);
        });
        return pubkeys;
    }

    /**
     * Setter for "p" tags, the pubkeys of badge awardees.
     *
     * @param {string[]} pTags - List of pubkeys being awarded.
     */
    set pTags(pubkeys: string[]) {
        this.removeTag("p");
        pubkeys.forEach((pubkey) => {
            this.tags.push(["p", pubkey]);
        });
    }
}

export default NDKBadgeAward;

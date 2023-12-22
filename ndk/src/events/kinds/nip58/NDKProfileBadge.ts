import type { NDK } from "../../../ndk/index.js";
import { NDKEvent, NDKTag, type NostrEvent } from "../../index.js";
import { NDKKind } from "../index.js";

interface NDKProfileBadgeAwardAndDefintionPair {
    a: NDKTag; // reference to badge definition event (don't include "a" in string array)
    e: NDKTag; // reference to a badge award event (don't include "e" in string array)
}

/**
 * Represents a NIP-58 Profile Badge.
 */
export class NDKProfileBadge extends NDKEvent {
    constructor(ndk: NDK | undefined, rawEvent?: NostrEvent) {
        super(ndk, rawEvent);
        this.kind ??= NDKKind.ProfileBadge;
        this.tags.push(["d", "profile_badges"]);
    }

    /**
     * Sets the badges to display, specified by award and badge definition apairs
     * @param pairs
     */
    setAwardAndDefinitionPairs(pairs: NDKProfileBadgeAwardAndDefintionPair[]) {
        // must be ordered consecutive pairs of a and e tags
        this.removeTag("a");
        this.removeTag("e");

        pairs.forEach((pair) => {
            this.tags.push(["a", ...pair.a]);
            this.tags.push(["e", ...pair.e]);
        });
    }
}

export default NDKProfileBadge;

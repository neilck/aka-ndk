import NDKBadgeDefinition from "../nip58/NDKBadgeDefinition";
import type { NDK } from "../../../ndk/index.js";
import { NDKEvent, type NostrEvent } from "../../index.js";
import type { NDKTag } from "../../index.js";
import { NDKKind } from "../index.js";

export class AKABadgeDefinition extends NDKBadgeDefinition {
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

    get applyURL(): string | undefined {
        return this.tagValue("applyURL");
    }

    /**
     * Setter for the badge name.
     *
     * @param {string | undefined} name - The badge short name to set for the badge.
     */
    set applyURL(name: string | undefined) {
        this.removeTag("applyURL");

        if (name) this.tags.push(["applyURL", name]);
    }
}

export default AKABadgeDefinition;

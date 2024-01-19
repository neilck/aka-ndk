import NDKBadgeDefinition from "../nip58/NDKBadgeDefinition";
import type { NDK } from "../../../ndk/index.js";
import { NDKEvent, type NostrEvent } from "../../index.js";
import type { NDKTag } from "../../index.js";
import { NDKKind } from "../index.js";

/**
 * badge can return data field values as strings when awarding pages
 * added to Award Badge event as tags as ["data", <name>, <value>]
 */
interface DataField {
    name: string; // name of data field
    label?: string; // optional display name of data field
    description?: string; // optional description of data field
}

/**
 * Extends BadgeDefinition event to support additional tags used by AKA Profiles.
 *
 * @class
 * @extends NDKBadgeDefinition
 * @param {NDK | undefined} ndk - The NDK instance or undefined.
 * @param {NostrEvent} rawEvent - The raw NostrEvent.
 * @property {NDKKind} kind - The kind of NDK, defaulted to NDKKind.BadgeDefinition.
 */
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

    /**
     * badge can return data which is added to Badge Award event
     * Data fields name the data fields it can return
     */
    get dataFields(): DataField[] {
        const dataFields: DataField[] = [];
        const tags = this.getMatchingTags("field");

        tags.forEach((tag) => {
            if (tag.length <= 1) return;

            const dataField: any = { name: tag[1] };
            if (tag.length >= 3) dataField.label = tags[2];
            if (tag.length >= 4) dataField.description = tags[3];

            dataFields.push(dataField as DataField);
        });

        return dataFields;
    }

    set dataFields(dataFields: DataField[]) {
        this.removeTag("field");

        dataFields.forEach((field) => {
            const tag: string[] = [];
            tag.push("field");
            tag.push(field.name);
            if (field.label) tag.push(field.label);
            if (field.label && field.description) tag.push(field.description);

            this.tags.push(tag);
        });
    }
}

export default AKABadgeDefinition;

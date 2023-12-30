import NDKBadgeDefinition from "../nip58/NDKBadgeDefinition";
import type { NDK } from "../../../ndk/index.js";
import { NDKEvent, type NostrEvent } from "../../index.js";
import type { NDKTag } from "../../index.js";
import { NDKKind } from "../index.js";

/**
 * Use defined parameteres and default values that the applyURL accepts
 */
interface UserParam {
    name: string; // name of query parameter
    value: string; // default value of query parameter during configuration
}

/**
 * applyURL can return data field values as strings when awarding pages
 * added to Award Badge event as tags as ["data", <name>, <value>]
 * added to Award Badge content as "<displayName1>: <value1>, <displayName2>: <value2>, ..."
 */
interface DataField {
    name: string; // name of data field
    value: string; // display name of data field
}

/**
 * Extends BadgeDefinition event to support addiontal tags used by AKA Profiles
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
     * Url to page where user can apply for this badge
     */
    get applyURL(): string | undefined {
        return this.tagValue("applyURL");
    }

    set applyURL(name: string | undefined) {
        this.removeTag("applyURL");

        if (name) this.tags.push(["applyURL", name]);
    }

    /**
     * Parameters applyURL can accept, passed as query string parameters
     */
    get userParams(): UserParam[] {
        const userParams: UserParam[] = [];
        const tags = this.getMatchingTags("userParam");
        tags.forEach((tag) => userParams.push({ name: tag[1], value: tag[2] }));
        return userParams;
    }

    set userParams(params: UserParam[]) {
        this.removeTag("userParam");

        params.forEach((param) => {
            this.tags.push(["userParam", param.name, param.value]);
        });
    }

    /**
     * helper instructions for using user-defined parameters in userParams.
     */
    get upHelp(): string | undefined {
        return this.tagValue("upHelp");
    }

    set upHelp(name: string | undefined) {
        this.removeTag("upHelp");

        if (name) this.tags.push(["upHelp", name]);
    }

    /**
     * applyURL can return data which is added to Badge Award event
     * Data fields name the data fields it can return
     */
    get dataFields(): DataField[] {
        const dataFields: DataField[] = [];
        const tags = this.getMatchingTags("field");
        tags.forEach((tag) => dataFields.push({ name: tag[1], value: tag[2] }));
        return dataFields;
    }

    set dataFields(dataFields: DataField[]) {
        this.removeTag("field");

        dataFields.forEach((field) => {
            this.tags.push(["field", field.name, field.value]);
        });
    }
}

export default AKABadgeDefinition;

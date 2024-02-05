// Read only class that stores start and end times

import { InvalidTimeError } from "./errors";

// End time must be greater than start time
class Time {
    readonly startTime: number;
    readonly endTime: number;

    constructor(startTime: number, endTime: number) {
        if (endTime <= startTime) {
            throw new InvalidTimeError(
                "End time must be greater than start time"
            );
        }

        this.startTime = startTime;
        this.endTime = endTime;
    }
}

// Check if the times overlap
function hasTimeOverlap(time1: Time, time2: Time): boolean {
    return time1.startTime < time2.endTime && time1.endTime > time2.startTime;
}

// Check if new time overlaps with a list of previous times
function isOverlappingPreviousTimes(
    newTime: Time,
    previousTimes: Time[]
): boolean {
    for (const time of previousTimes) {
        if (hasTimeOverlap(newTime, time)) {
            return true;
        }
    }

    return false;
}

export default Time;
export { hasTimeOverlap, isOverlappingPreviousTimes };

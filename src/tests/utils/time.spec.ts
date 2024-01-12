import { expect } from "chai";
import Time, { hasTimeOverlap, isOverlappingPreviousTimes } from "../../utils/time";

describe("Session Time Keeping", () => {
    describe("Time class", () => {
        it("returns Time given valid start and end time", () => {
            const startTime = 1999870936051;
            const endTime = 4723300584255;
        });

        it("throws InvalidTimeError given end time > start time", () => {
            const startTime = 5943966477870;
            const endTime = 3621633327021;
        });
    });

    // TODO: Check edge case if a time endpoint equals another
    describe("hasTimeOverlap function", () => {
        it("returns true given partially overlapping times", () => {
            const time1 = new Time(7048618956754, 9495521357310);
            const time2 = new Time(6488792678881, 8254413150185);

            const overlap = hasTimeOverlap(time1, time2);

            expect(overlap).to.be.true;
        });

        it("returns true given completely overlapping times", () => {
            const time1 = new Time(3822054562432, 6827758805988);
            const time2 = new Time(4806068492890, 5759194102118);

            const overlap = hasTimeOverlap(time1, time2);

            expect(overlap).to.be.true;
        });

        it("returns false given non-overlapping times", () => {
            const time1 = new Time(4469172840497, 5521046069046);
            const time2 = new Time(2655917136891, 3203492695611);

            const overlap = hasTimeOverlap(time1, time2);

            expect(overlap).to.be.false;
        });
    });

    // TODO: Different checks if overlapping just one or multiple
    describe("isOverlappingPreviousTimes function", () => {
        it("returns true given overlapping new time", () => {
            const newTime = new Time(1243165119781, 2862651537552);
            const previousTimesList = [
                [5412045965284, 6351330397749],
                [7952089893175, 8261741036070],
                [2585377374694, 3200074115562], // newTime overlaps here
                [4563239274958, 5626207844334],
            ];
            
            let previousTimes: Time[] = [];
            for (const time of previousTimesList) {
                previousTimes.push(new Time(time[0], time[1]));
            }

            const overlap = isOverlappingPreviousTimes(newTime, previousTimes);

            expect(overlap).to.be.true;
        });

        it("returns false given non-overlapping new time", () => {
            const newTime = new Time(4888287953138, 5948633739811);
            const previousTimesList = [
                [1816871880353, 1915723923345],
                [2424798364688, 3263524414013],
                [6032718394107, 7369514770039],
                [8363323829637, 9854743210146],
            ];
            
            let previousTimes: Time[] = [];
            for (const time of previousTimesList) {
                previousTimes.push(new Time(time[0], time[1]));
            }

            const overlap = isOverlappingPreviousTimes(newTime, previousTimes);

            expect(overlap).to.be.false;
        });
    });
});
import Utility from "../../../lib/utility.js";
class FlowUtility {


    static getEvenlySpacedFromCenter(totalDivisonAvailable, divisonElements, divisonElementDimension, minseparation) {
        if (totalDivisonAvailable == 0) {
            return { coordinates: [], divisonElementDimensions: [] }
        }
        //console.log('getEvenlySpacedFromCenter',totalDivisonAvailable, divisonElements, divisonElementDimension, minseparation)
        var coordinates = [], divisonElementDimensions = []
        //Calculate Max possible div dimension
        var maxdivisonDimensionPossible = totalDivisonAvailable / divisonElements;

        //Calculation Divison Dimesion required with margins on both sides
        var divisonDimensionWithSeperation = divisonElementDimension + 2 * (minseparation);

        //Calculate Left over  divison not occupying dimension
        var leftOverDivisonFreeDimension = maxdivisonDimensionPossible - divisonDimensionWithSeperation;

        //Calculate Total Left over  divison not occupying dimension
        var totalleftOverDivisonFreeDimension = leftOverDivisonFreeDimension * divisonElements
        if (leftOverDivisonFreeDimension > 0) {

            var requiredTotalValue = totalDivisonAvailable - totalleftOverDivisonFreeDimension
            for (var i = 0; i < divisonElements; i++) {
                var x = totalleftOverDivisonFreeDimension / 2 + (divisonDimensionWithSeperation * i) + (divisonDimensionWithSeperation * 0.5)
                coordinates.push(x)
                divisonElementDimensions.push(divisonElementDimension)
            }
            return { coordinates, divisonElementDimensions }
        } else {
            //Decrease divison element dimension less then max divison 
            divisonElementDimension = maxdivisonDimensionPossible - 2 * (minseparation / 2) - 1;//-1 for imax depth issue

            //Recalculate Coordinates based on new divison value
            return FlowUtility.getEvenlySpacedFromCenter(totalDivisonAvailable, divisonElements, divisonElementDimension, minseparation / 2)
        }
    }

    static subscribeResize(element, callback) {
        var selfObserver = new ResizeObserver(Utility.debounce(entries => {
            entries.forEach(entry => {               
                callback(entry)
                
                // console.log(entry.target)
                // console.log('width', entry.contentRect.width);
                // console.log('height', entry.contentRect.height);
                // console.log('x',entry.contentRect.top)
                // console.log('y',entry.contentRect.bottom)
            });
        },100));
        selfObserver.observe(element);
    }


}

export default FlowUtility
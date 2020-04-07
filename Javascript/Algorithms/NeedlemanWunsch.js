class NeedlemanWunsch {
    constructor() {
        this.sequenceA;
        this.sequenceB;
        this.matrixObject = null;
        this.mismatchPenalty = -1;
    }

    align(sequenceA, sequenceB) {
        if (sequenceA == sequenceB) {
            return new Alignment(sequenceA, sequenceB, sequenceA.length);
        }

        this.matrixObject = this.initializeMatrix(sequenceA, sequenceB);
        let alignment = this.calculateAlignment();
        return new Alignment(alignment[0], alignment[1], alignment[2]);
    }

    initializeMatrix(sequenceA, sequenceB) {

        this.sequenceA = sequenceA;
        this.sequenceB = sequenceB;

        let lengthA = this.sequenceA.length;
        let lengthB = this.sequenceB.length;
        let mismatchPenalty = this.mismatchPenalty;

        let matrixObject = new Matrix(lengthA + 1, lengthB + 1);
        let matrix = matrixObject.getMatrix();

        //Create F-matrix
        for (let rowIndex = 0; rowIndex <= lengthA; rowIndex++) {
            matrix[rowIndex][0] = mismatchPenalty * rowIndex;
        }

        for (let columnIndex = 0; columnIndex <= lengthB; columnIndex++) {
            matrix[0][columnIndex] = mismatchPenalty * columnIndex;
        }

        for (let rowIndex = 1; rowIndex <= lengthA; rowIndex++) {
            for (let columnIndex = 1; columnIndex <= lengthB; columnIndex++) {
                let match = matrix[rowIndex - 1][columnIndex - 1] + this.similarityFactor(rowIndex, columnIndex);
                let deletion = matrix[rowIndex - 1][columnIndex] + mismatchPenalty;
                let insertion = matrix[rowIndex][columnIndex - 1] + mismatchPenalty;
                matrix[rowIndex][columnIndex] = Math.max(match, deletion, insertion);
            }
        }

        return matrixObject;
    }

    calculateAlignment() {

        let matrixObject = this.matrixObject;

        if (matrixObject == null) {
            console.log("Please initialize create the matrix first!");
            return;
        }

        let matrix = matrixObject.getMatrix();

        let sequenceA = this.sequenceA;
        let sequenceB = this.sequenceB;
        let lengthA = this.sequenceA.length;
        let lengthB = this.sequenceB.length;
        let mismatchPenalty = this.mismatchPenalty;

        //Find optimal path
        let rowIndex = lengthA;
        let columnIndex = lengthB;

        let alignedStringA = "";
        let alignedStringB = "";

        let matches = 0;

        while (rowIndex > 0 || columnIndex > 0) {

            if (rowIndex > 0 && columnIndex > 0 && matrix[rowIndex][columnIndex] == matrix[rowIndex - 1][columnIndex - 1] + this.similarityFactor(rowIndex, columnIndex)) {
                alignedStringA = sequenceA[rowIndex - 1] + alignedStringA;
                alignedStringB = sequenceB[columnIndex - 1] + alignedStringB;

                matches = sequenceA[rowIndex - 1] == sequenceB[columnIndex - 1] ? matches + 1 : matches;

                rowIndex--;
                columnIndex--;
            }

            else if (rowIndex > 0 && matrix[rowIndex][columnIndex] == matrix[rowIndex - 1][columnIndex] + mismatchPenalty) {
                alignedStringA = sequenceA[rowIndex - 1] + alignedStringA;
                alignedStringB = "-" + alignedStringB;
                console.log[sequenceA, sequenceB];
                rowIndex--;
            }

            else {
                alignedStringA = "-" + alignedStringA;
                alignedStringB = sequenceB[columnIndex - 1] + alignedStringB;
                console.log[sequenceA, sequenceB];
                columnIndex--;
            }
        }

        return [
            alignedStringA, 
            alignedStringB, 
            matches, 
        ];
    }

    similarityFactor(indexA, indexB) {
        let characterA = this.sequenceA[indexA - 1];
        let characterB = this.sequenceB[indexB - 1];
        let similarityFactor = (characterA === characterB) ? 1 : -1;
        return similarityFactor;
    }
}
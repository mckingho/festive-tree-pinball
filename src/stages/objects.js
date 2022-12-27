let instance;
/// matter objects to be added in different levels,
/// to be included in main board object.

class StageObjects {
    constructor() {
        if (!instance) {
            this.objects = [];
        }
        return instance;
    }
}

export default StageObjects;

module.exports = function () {
    this.collectionPost = function (db) {
        db.createCollection("Post", {autoIndexId: true});
    };
    this.collectionUser = function (db) {
        db.createCollection("User", {autoIndexId: true});
    };
};

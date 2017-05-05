/**
 * @packet photo.test;
 * @require photo.show;
 */
Option({
    name:"boot",
    option:{
        override:{
            onendinit:function () {
                this.addChild({
                    type:"@show.gallery",
                    option:{
                    },
                    container:this.finders("container")
                });
            }
        }
    }
});
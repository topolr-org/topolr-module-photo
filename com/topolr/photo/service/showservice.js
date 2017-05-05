/**
 * @packet photo.service.showservice;
 */

Module({
    name:"galleryservice",
    extend:"localservice",
    action_set:function(option){
        this.data=$.extend(true,{},option);
        this.data.bigImages=[];
        this.data.thumbImages=[];
        for(var i=0;i<this.data.images.length;i++){
            var image=this.data.images[i];
            if(image.big) {
                this.data.bigImages.push(image.big);
            }
            if(image.thumb){
                this.data.thumbImages.push(image.thumb);
            }
        }
        this.trigger();
        this.start();
    },
    service_setimages:function (array) {

    }
});
/**
 * @packet photo.service.showservice;
 */

Module({
    name:"galleryservice",
    extend:"localservice",
    action_set:function(option){
        this.data=$.extend(true,{},option);
        this.data.thumbImages=[];
        for(var i=0;i<this.data.images.length;i++){
            var image=this.data.images[i];
            if(image.thumb){
                this.data.thumbImages.push({
                    img:image.thumb,
                    index:i
                });
            }
        }
        this.trigger();
        this.start();
    },
    service_setimages:function (array) {
        this.data.images=this.data.images.concat(array);
        this.data.thumbImages=[];
        for(var i=0;i<this.data.images.length;i++){
            var image=this.data.images[i];
            if(image.thumb){
                this.data.thumbImages.push({
                    img:image.thumb,
                    index:i
                });
            }
        }
        this.trigger();
    }
});
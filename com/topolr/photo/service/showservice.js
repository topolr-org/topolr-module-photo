/**
 * @packet photo.service.showservice;
 */

Module({
    name:"galleryservice",
    extend:"localservice",
    goto:function (index) {
        if(index>=0&&index<this.data.images.length){
            this.data.current=index;
            for(var i=0;i<this.data.thumbImages.length;i++){
                this.data.thumbImages[i].active=false;
            }
            this.data.thumbImages[this.data.current].active=true;
            this.data.currentImage=this.data.images[this.data.current];
            this.trigger();
        }
    },
    action_set:function(images){
        this.data.images=images;
        this.data.thumbImages=[];
        this.data.current=0;
        for(var i=0;i<this.data.images.length;i++){
            var image=this.data.images[i];
            if(image.thumb){
                this.data.thumbImages.push({
                    img:image.thumb,
                    index:i,
                    active:false
                });
            }
        }
        for(var i=0;i<this.data.thumbImages.length;i++){
            this.data.thumbImages[i].active=false;
        }
        this.data.thumbImages[this.data.current].active=true;
        this.data.currentImage=this.data.images[this.data.current];
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
        for(var i=0;i<this.data.thumbImages.length;i++){
            this.data.thumbImages[i].active=false;
        }
        this.data.thumbImages[this.data.current].active=true;
        this.data.currentImage=this.data.images[this.data.current];
        this.trigger();
    },
    service_gotoimage:function (index) {
        this.goto(index);
    },
    service_previmage:function () {
        this.goto(this.data.current-1);
    },
    service_nextimage:function () {
        this.goto(this.data.current+1);
    }
});
/**
 * @packet photo.show;
 * @require photo.util.canvas;
 * @require util.file;
 * @css photo.style.gallery;
 * @css photo.style.style;
 * @template photo.template.show;
 * @require photo.service.showservice;
 * @require util.uikit;
 */
Module({
    name: "gallery",
    className: "gallery",
    extend: "viewgroup",
    layout:"@show.gallery",
    services:{"gallery":"@showservice.galleryservice"},
    option: {
        url: "gallery.json",
        images:[],
        viewerType:"@.imageviewer",
        listType:"@.thumblist",
        listWidth:80
    },
    init: function (option) {
        this.getService("gallery").action("set",this.option.images);
    },
    update:function (data) {
        this.getChildByType(this.option.listType).setImages(data.thumbImages);
        this.getChildByType(this.option.viewerType).setImage(data.currentImage.big);
    },
    gotoImage: function (num) {
        this.getService("gallery").trigger("gotoimage",num);
    },
    nextImage: function () {
        this.getService("gallery").trigger("nextimage");
    },
    prevImage: function () {
        this.getService("gallery").trigger("previmage");
    },
    event_thumbclick:function (e) {
        this.gotoImage(e.data.index);
    }
});
Module({
    name:"imageviewer",
    extend:"view",
    className:"imageviewer",
    template:"@show.imageviewer",
    option:{
        rotateoffset: 10,
        zoomoffset: 0.2,
        tools: [
            {type: "zoomIn", icon: "mt-photo-zoom_in"},
            {type: "zoomOut", icon: "mt-photo-zoom_out"},
            {type: "rotateLeft", icon: "mt-photo-rotate_left"},
            {type: "rotateRight", icon: "mt-photo-rotate_right"},
            {type: "download", icon: "mt-photo-vertical_align_bottom"},
            {type: "reset", icon: "mt-photo-refresh"}
        ]
    },
    init:function () {
        var option=this.option;
        this.render(option);
        option.sceneWidth = this.dom.width();
        option.sceneHeight = this.dom.height();
        var canvas = require("@canvas");
        this.dom.width(option.sceneWidth).height(option.sceneHeight);
        var scene = this.dom.display();
        var baseContainer = canvas.create("DisplayObjectContainer", {
            id: "aa",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: 0,
            y: 0
        });
        var r = Math.sqrt(option.sceneWidth * option.sceneWidth + option.sceneHeight * option.sceneHeight);
        var imageContainer = canvas.create("DisplayObjectContainer", {
            id: "imageContainer",
            width: r,
            height: r,
            x: -(r - option.sceneWidth) / 2,
            y: -(r - option.sceneHeight) / 2,
            init: function () {
                this.ismove = false;
                this.cleft = 0;
                this.ctop = 0;
            },
            onmousedown: function (e) {
                var b = this.getChildAt(0);
                var a = b.getLocalRelativeRootPoint(e.pageX, e.pageY);
                this.cleft = a.x - b.x();
                this.ctop = a.y - b.y();
            },
            onmousemove: function (e) {
                if (this.ismove) {
                    if (this.getChildAt(0).width() > this.getChildAt(1).width() || this.getChildAt(0).height() > this.getChildAt(1).height()) {
                        var b = this.getChildAt(0);
                        var a = b.getLocalRelativeRootPoint(e.pageX, e.pageY);
                        var _x = a.x - this.cleft;
                        var _y = a.y - this.ctop;
                        if (_x < this.getChildAt(1).x()) {
                            if (_x > this.getChildAt(1).x() - (this.getChildAt(0).width() - this.getChildAt(1).width())) {
                                b.x(a.x - this.cleft);
                            } else {
                                b.x(this.getChildAt(1).x() - (this.getChildAt(0).width() - this.getChildAt(1).width()));
                            }
                        } else {
                            b.x(this.getChildAt(1).x());
                        }
                        if (_y < this.getChildAt(1).y()) {
                            if (_y > this.getChildAt(1).y() - (this.getChildAt(0).height() - this.getChildAt(1).height())) {
                                b.y(a.y - this.ctop);
                            } else {
                                b.y(this.getChildAt(1).y() - (this.getChildAt(0).height() - this.getChildAt(1).height()));
                            }
                        } else {
                            b.y(this.getChildAt(1).y());
                        }
                    }
                }
            },
            onmouseup: function () {
                this.ismove = false;
            }
        });
        imageContainer.rotatePoint(option.sceneWidth / 2, option.sceneHeight / 2);
        var image = canvas.create("ImageDisplay", {
            id: "image",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: (r - option.sceneWidth) / 2,
            y: (r - option.sceneHeight) / 2,
            rotate: 0
        });
        image.rotatePoint((r - option.sceneWidth) / 2, (r - option.sceneHeight) / 2);
        var squart = canvas.create("SquartDisplay", {
            id: "squart",
            width: option.sceneWidth,
            height: option.sceneHeight,
            x: (r - option.sceneWidth) / 2,
            y: (r - option.sceneHeight) / 2,
            onmousedown: function () {
                this.parent().ismove = true;
            }
        });
        imageContainer.addChild(image).addChild(squart);
        baseContainer.addChild(imageContainer);
        scene.addChild(baseContainer);
        this.image = image;
        this.imageContainer = imageContainer;
        this.baseContainer = baseContainer;
        this.r = r;
    },
    bind_btn:function(dom){
        var data=dom.cache(),type=data.type;
        if(this[type]){
            this[type](data);
        }
        this.dispatchEvent(type,data);
    },
    setImage: function (url) {
        var ths = this;
        $.loadingbar().showLoading("loading...");
        $.loader().image(url, function () {
            $.loadingbar().close();
            var ximage = this, _w = ximage.width, _h = ximage.height, image = ths.image;
            image.canvas.width = _w;
            image.canvas.height = _h;
            image.props({
                width: _w,
                height: _h,
                x: (ths.r - _w) / 2,
                y: (ths.r - _h) / 2,
                rotate: 0
            });
            image.setImage(this, "fit");
            ths.imageContainer.rotate(0);
        });
    },
    _resize: function () {
        if (this.dom.find(".list").height() > this.dom.find(".listcon").height()) {
            this.dom.find(".listcon").bind("mousemove", function (e) {
                var offset = $(this).children(0).height() - $(this).height();
                var a = offset * (e.pageY - $(this).offset().top) / $(this).height();
                $(this).scrollTop(a);
            });
        } else {
            this.dom.find(".listcon").unbind("mousemove");
        }
    },
    zoomIn: function () {
        var image = this.image, offset = this.option.zoomoffset;
        var _w = image.width() + image.width() * offset;
        if (_w / image.image.width <= 5) {
            image.props({
                width: _w,
                height: image.height() + image.height() * offset,
                x: image.x() - image.width() * offset / 2,
                y: image.y() - image.height() * offset / 2
            });
        }
    },
    zoomOut: function () {
        var image = this.image, offset = this.option.zoomoffset;
        var container = this.imageContainer;
        if (container.getChildAt(0).width() > container.getChildAt(1).width() || container.getChildAt(0).height() > container.getChildAt(1).height()) {
            var _w = image.width() - image.width() * offset;
            var _h = image.height() - image.height() * offset;
            if (_w < this.option.sceneWidth) {
                _w = this.option.sceneWidth;
                _h = image.height() / image.width() * _w;
                if (_h < this.option.sceneHeight) {
                    _h = this.option.sceneHeight;
                    _w = image.width() / image.height() * _h;
                }
            }
            if (_h < this.option.sceneHeight) {
                _h = this.option.sceneHeight;
                _w = image.width() / image.height() * _h;
                if (_w < this.option.sceneWidth) {
                    _w = this.option.sceneWidth;
                    _h = image.height() / image.width() * _w;
                }
            }
            var _x = image.x() + image.width() * offset / 2;
            var _y = image.y() + image.height() * offset / 2;
            if (_x < container.getChildAt(1).x()) {
                if (_x > container.getChildAt(1).x() - (container.getChildAt(0).width() - container.getChildAt(1).width())) {
                } else {
                    _x = container.getChildAt(1).x() - (container.getChildAt(0).width() - container.getChildAt(1).width());
                }
            } else {
                _x = container.getChildAt(1).x();
            }
            if (_y < container.getChildAt(1).y()) {
                if (_y > container.getChildAt(1).y() - (container.getChildAt(0).height() - container.getChildAt(1).height())) {
                } else {
                    _y = container.getChildAt(1).y() - (container.getChildAt(0).height() - container.getChildAt(1).height());
                }
            } else {
                _y = container.getChildAt(1).y();
            }
            if (_w + _x < container.getChildAt(1).x() + container.getChildAt(1).width()) {
                _x = container.getChildAt(1).x() + container.getChildAt(1).width() - _w;
            }
            if (_h + _y < container.getChildAt(1).y() + container.getChildAt(1).height()) {
                _y = container.getChildAt(1).y() + container.getChildAt(1).height() - _h;
            }
            image.props({
                width: _w,
                height: _h,
                x: _x,
                y: _y
            });
        }
    },
    rotateRight: function () {
        this.imageContainer.rotate(this.imageContainer.rotate() + this.option.rotateoffset);
    },
    rotateLeft: function () {
        this.imageContainer.rotate(this.imageContainer.rotate() - this.option.rotateoffset);
    },
    download: function () {
        var option = this.option;
        try {
            var uri = this.image.getImageDate(0, 0, this.image.image.width, this.image.image.height);
            var file = require("@file");
            var blob = file.getBlobFromURI(uri);
            file.saveAs(blob, "photocutter.png");
        } catch (e) {
            console.info("download error");
        }
    },
    reset: function () {
        var ximage = this.image.image, _w = ximage.width, _h = ximage.height;
        this.image.props({
            width: _w,
            height: _h,
            x: (this.r - _w) / 2,
            y: (this.r - _h) / 2,
            rotate: 0
        });
        this.imageContainer.rotate(0);
    }
});
Module({
    name:"thumblist",
    extend:"view",
    template:"@show.thumblist",
    className:"thumblist",
    option:{
        list:[]
    },
    init:function () {
        this.render(this.option.list);
    },
    setImages:function (array) {
        this.render(this.option.list.concat(array));
    },
    bind_img:function (dom) {
        var data=dom.cache();
        this.dispatchEvent("thumbclick",data);
    }
});
/**
 * @packet photo.test;
 * @require photo.show;
 */
Option({
    name:"boot",
    option:{
        override:{
            onendinit:function () {
                // this.addChild({
                //     type:"@show.imageviewer",
                //     container:this.finders("container")
                // }).then(function (a) {
                //     a.setImage("http://img.zcool.cn/community/017774590c0cfda8012145501412d9.jpg@900w_1l_2o_100sh.jpg");
                // });
                this.addChild({
                    type:"@show.gallery",
                    option:{
                        images:[
                            {
                                big:"http://img.zcool.cn/community/017774590c0cfda8012145501412d9.jpg@900w_1l_2o_100sh.jpg",
                                thumb:"http://img.zcool.cn/community/0319558590c0dd7a8012145506bfcea.jpg@250w_188h_1c_1e_2o_100sh.jpg",
                                desc:"aa"
                            },
                            {
                                big:"http://img.zcool.cn/community/021530590bd445a801214550a1c082.jpg",
                                thumb:"http://img.zcool.cn/community/00662f590bd598a8012145505cfe5f.jpg@250w_188h_1c_1e_2o_100sh.jpg",
                                desc:"bb"
                            }
                        ]
                    },
                    container:this.finders("container")
                });
            }
        }
    }
});
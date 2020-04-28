let config = {
    dev: {
        global:{
            TYPE:'Local development',
            DEBUGGING:true,
            ASSETS_PATH:'assets/',
            DATA_ASSETS_PATH:'assets/data/',
            // DATA_FILE:'',
            DATA_FILE:'test-d18edc37f5044d61673539983b762979-parcelboilerplatedatatest-data.json',
        }
    },
    stage: {
        global:{
            TYPE:'Staging',
            DEBUGGING:true,
            ASSETS_PATH:'http://localhost:8888/local-deploy/stage/parceljs-boilerplate/assets/',
            DATA_ASSETS_PATH:'https://storage.googleapis.com/sheet-parser/',
            DATA_FILE:'test-d18edc37f5044d61673539983b762979-parcelboilerplatedatatest-data.json',
        },
        DEPLOY_FOLDER:'/Volumes/staging/',
        OVERWRITE_CONFIRM:true,
        MINIFY:false,
        WEBDOK:false,
        BASE_URL:'http://localhost:8888/local-deploy/stage/',
    },
    deploy: {
        global:{
            TYPE:'Production',
            DEBUGGING:false,
            ASSETS_PATH:'http://localhost:8888/local-deploy/deploy/parceljs-boilerplate/assets/',
            DATA_ASSETS_PATH:'https://storage.googleapis.com/sheet-parser/',
            DATA_FILE:'d18edc37f5044d61673539983b762979-parcelboilerplatedatatest-data.json',
        },
        DEPLOY_FOLDER: '/Volumes/2020/',
        OVERWRITE_CONFIRM:true,
        WEBDOK:false,
        MINIFY:true,
        BASE_URL:'http://localhost:8888/local-deploy/deploy/',
    }
}
module.exports = config;
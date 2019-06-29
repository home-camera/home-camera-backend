{
    "targets": [
        {
            "target_name": "addon",
            "sources": [ 
                "native/addon.cpp",
                "native/camera/camera.cpp",
                "native/camera/frame.cpp",
                "native/workers/camera_reader_async_worker.cpp",
                "native/workers/frame_processing_async_worker.cpp"
            ],
            "link_settings": {
                "libraries": ["-lopencv_core", "-lopencv_highgui", "-lopencv_imgproc", "-lopencv_video", "-lopencv_ml"]
            },
            "cflags": [
                "-g", "-std=c++11", "-Wall"
            ],
            "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
            "conditions": [
                ['OS=="linux"', {
                    'include_dirs': [
                        "<!@(pkg-config opencv --cflags | cut -b 3-)",
                        "<!@(node -p \"require('node-addon-api').include\")"
                        ],
                    'link_settings': {
                        'library_dirs': [
                          "<!@(pkg-config opencv --libs-only-L | cut -b 3-)",
                        ]
                    },
                    'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
                    'cflags!': ['-fno-exceptions'],
                    'cflags_cc!': ['-fno-rtti', '-fno-exceptions']
                }],
                ['OS=="mac"', {
                    'cflags+': ['-fvisibility=hidden'],
                    'include_dirs': [
                        "<!@(pkg-config opencv --cflags | cut -b 3-)",
                        "<!@(node -p \"require('node-addon-api').include\")"
                        ],
                    'link_settings': {
                        'library_dirs': [
                          "<!@(pkg-config opencv --libs-only-L | cut -b 3-)",
                        ]
                    },
                    'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
                    'xcode_settings': {
                        'MACOSX_DEPLOYMENT_TARGET' : '10.7',
                        'OTHER_CFLAGS': [
                            "-mmacosx-version-min=10.7",
                            "-std=c++11",
                            "-stdlib=libc++"
                        ],
                        'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES',
                        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                        'GCC_ENABLE_CPP_RTTI': 'YES'
                    }
                }]
            ]
    }
    ]
}
exports.conf = {
    dependencies: {
        themes: {
            'theme-open-ent': '../theme-open-ent/**/*',
            'entcore-css-lib': '../entcore-css-lib/**/*',
            'generic-icons': '../generic-icons/**/*'
        },
        widgets: {
            'notes': '../notes/**/*',
            'calendar-widget': '../calendar-widget/**/*',
            'record-me': '../record-me/**/*',
            'my-apps': '../my-apps/**/*',
            'carnet-de-bord': '../carnet-de-bord/**/*'
        }
    },
    overriding: [
        { 
            parent: 'theme-open-ent', 
            child: 'leo',
            skins: ['default', 'dyslexic']
        }
    ]
};
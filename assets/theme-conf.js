exports.conf = {
    overriding: [
        { 
            parent: 'theme-open-ent', 
            child: 'paris',
            group: 'switch',
            skins: ['default', 'dyslexic'],
            help: '/help-2d',
            bootstrapVersion: 'ode-bootstrap-neo',
            edumedia:{
                "uri": "https://www.edumedia-sciences.com",
                "pattern": "uai-token-hash-[[uai]]",
                "ignoreSubjects":["n-92","n-93"]
            }
        },
        { 
            parent: 'panda', 
            child: 'paris1d',
            group: 'switch',
            bootstrapVersion: 'ode-bootstrap-one',
            skins: ['circus', 'desert', 'neutre', 'ocean', 'panda-food', 'sparkly', 'default'],
            help: '/help-1d',
            edumedia:{
                "uri": "https://junior.edumedia-sciences.com",
                "pattern": "uai-token-hash-[[uai]]"
            }
        }
    ]
};

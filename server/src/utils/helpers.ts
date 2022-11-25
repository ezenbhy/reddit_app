export const slugify = function (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim 공백문자로 시작 또는 공백문자로 끝나는것 다 찾기
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars  [^제외문자 공백 하이픈]
        .replace(/\s+/g, '-') // collapse whitespace 공백문자 and replace by - 
        .replace(/-+/g, '-'); // collapse dashes 

    return str;
};


export function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
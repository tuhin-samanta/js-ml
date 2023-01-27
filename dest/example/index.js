"use strict";
(function () {
    try {
        let url = new URL(window.location.href);
        if (url.searchParams.has("try")) {
            let module = url.searchParams.get("try");
            import(`./${module}/index.js`).then((data) => {
                console.log({ data });
            });
        }
    }
    catch (err) {
        console.log(err);
    }
})();

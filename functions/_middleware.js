export async function onRequest(context) {
  const response = await context.next();

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("text/html")) {

    const metaTags = `
    <meta property="og:site_name" content="GUENESI">
    <meta property="og:title" content="Сайт с проектами (моими)">
    <meta property="og:description" content="[ВСТАВЬТЕ_СЮДА_ТЕКСТ]">
    <meta property="og:url" content="https://quenesi.pages.dev/">
    <meta property="og:type" content="website">

    <meta property="og:image" content="https://quenesi.pages.dev/tg.png">
    <meta property="og:image:secure_url" content="https://quenesi.pages.dev/tg.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/png">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Сайт с проектами (моими)">
    <meta name="twitter:description" content="[ВСТАВЬТЕ_СЮДА_ТЕКСТ]">
    <meta name="twitter:image" content="https://quenesi.pages.dev/tg.png">
    `;

    const loaderHTML = `
    <div id="page-loader" class="QWER1111111TY" >
        <div class="loader-spinner"></div>
    </div>
    <style>
        .QWER1111111TY { 
            position: fixed !important;
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background-color: #4376dc; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            z-index: 2147483647 !important;
            transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .loader-spinner { 
            width: 50px; 
            height: 50px; 
            border: 5px solid rgb(43 74 142); 
            border-top: 5px solid #ffb700; 
            border-radius: 50%; 
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .loader-fade-out { 
            opacity: 0 !important;
            visibility: hidden !important;
         }
    </style>
    `;

    const loaderScript = `
    <script>
        window.addEventListener('load', function () {
            var loader = document.getElementById('page-loader');
            if (loader) {
                loader.classList.add('loader-fade-out');
                setTimeout(function() { loader.remove(); }, 400);
            }
        });
    </script>
    `;

    return new HTMLRewriter()
      .on("head", {
        element(el) {
          el.append(metaTags, { html: true });
        },
      })
      .on("body", {
        element(el) {
          el.prepend(loaderHTML, { html: true });
        },
      })
      .on("body", {
        element(el) {
          el.append(loaderScript, { html: true });
        },
      })
      .transform(response);
  }

  return response;
}

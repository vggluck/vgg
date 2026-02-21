const fs = require('fs');
const http = require('http');
const path = require('path');

/**
 * Основная функция парсинга VGG кода в HTML
 */
function parseVGG(content) {
    // Проверка обязательных тегов начала и конца
    if (!content.includes('!vgg = start') || !content.includes('end')) {
        return `
        <html><body style="background:#000;color:red;font-family:monospace;padding:20px;">
        VGG_INTERPRETER_ERROR: Структура файла повреждена. Проверьте наличие '!vgg = start' и 'end'.
        </body></html>`;
    }

    // Извлечение блока настроек WEB
    const webBlock = content.match(/open:web([\s\S]*?)close:web/);
    const webContent = webBlock ? webBlock[1] : "";
    
    const title = webContent.match(/title of page:\s*(.*)/)?.[1]?.trim() || "VGG Page";
    const fontLink = webContent.match(/fontlink:\s*(.*)/)?.[1]?.trim();
    const fontName = webContent.match(/font:\s*(.*)/)?.[1]?.trim();

    // Сборка контента из блоков LABEL
    let labelsHTML = "";
    const labelRegex = /open:label([\s\S]*?)close:label/g;
    let match;

    while ((match = labelRegex.exec(content)) !== null) {
        const block = match[1];
        
        // Извлечение параметров внутри лейбла
        const text = block.match(/text:\s*([\s\S]*?)\(close=text\)/)?.[1]?.trim();
        const color = block.match(/color:\s*(.*?)\(close=color\)/)?.[1]?.trim();
        const font = block.match(/font:\s*(.*?)\(close=font\)/)?.[1]?.trim();

        // Сборка инлайновых стилей
        let style = "";
        if (color) style += `color:${color};`;
        if (font) style += `font-family:'${font}';`;

        if (text) {
            labelsHTML += `<div class="vgg-label" style="${style}">${text}</div>\n`;
        }
    }

    // Сборка финального HTML документа
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${fontLink ? `<link rel="stylesheet" href="${fontLink}">` : ""}
    <style>
        body {
            background-color: #000;
            color: #fff;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-family: ${fontName ? `'${fontName}', sans-serif` : "sans-serif"};
        }
        .vgg-label {
            margin: 10px 0;
            transition: transform 0.3s ease;
        }
        .vgg-label:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    ${labelsHTML}
</body>
</html>`;
}

// --- ЛОГИКА ЗАПУСКА ---

const args = process.argv.slice(2);

// Режим компиляции (для GitHub Actions / Vercel)
if (args[0] === 'compile_all') {
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

    const files = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.vgg'));
    
    if (files.length === 0) {
        console.log("[VGG] Файлы .vgg не найдены.");
        process.exit(1);
    }

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const html = parseVGG(content);
        
        // Если файл main.vgg, делаем его index.html
        let outName = file.replace('.vgg', '.html');
        if (file === 'main.vgg') outName = 'index.html';
        
        fs.writeFileSync(path.join(distDir, outName), html);
        console.log(`[VGG] Скомпилировано: ${file} -> ${outName}`);
    });
    
    console.log("[VGG] Компиляция завершена успешно.");
    process.exit(0);
} 

// Режим сервера (для локальной разработки)
const PORT = 3000;
const server = http.createServer((req, res) => {
    let url = req.url === '/' ? '/main.vgg' : req.url;
    if (!url.endsWith('.vgg')) url += '.vgg';
    
    const filePath = path.join(process.cwd(), url);

    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(parseVGG(content));
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end("VGG_ERROR 404: Файл не найден. Создайте main.vgg в этой папке.");
    }
});

server.listen(PORT, () => {
    console.log(`
    VGG Engine запущен!
    Локальный адрес: http://localhost:${PORT}
    
    Для компиляции в HTML используйте: node vgg_core.js compile_all
    `);
});

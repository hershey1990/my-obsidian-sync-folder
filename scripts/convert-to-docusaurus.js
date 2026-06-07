#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '..', 'patioz');
const TARGET_DIR = path.resolve(__dirname, '..', 'recruitment-docs', 'docs', 'patioz-docs');

const stats = {
  filesFound: 0,
  filesWritten: 0,
  wikilinksConverted: 0,
  externalWikilinks: 0,
  embedsResolved: 0,
  dataviewBlocksRemoved: 0,
};

function walkDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function buildFileMap(dir) {
  const map = {};
  const files = walkDir(dir);
  for (const file of files) {
    const relative = path.relative(dir, file).replace(/\\/g, '/');
    const nameWithoutExt = relative.replace(/\.md$/, '');
    map[nameWithoutExt] = nameWithoutExt;

    const parent = path.dirname(relative).replace(/\\/g, '/');
    const basename = path.basename(nameWithoutExt);
    const withoutPrefix = basename.replace(/^\d+-/, '');
    if (withoutPrefix !== basename) {
      const key = parent === '.' ? withoutPrefix : `${parent}/${withoutPrefix}`;
      if (!map[key]) {
        map[key] = nameWithoutExt;
      }
    }
  }
  return map;
}

function resolveWikilink(target, fileMap) {
  target = target.replace(/\\/g, '/');
  if (fileMap[target]) return fileMap[target];
  const stripped = target.replace(/^patioz\//, '');
  if (fileMap[stripped]) return fileMap[stripped];
  const noLeadingSlash = target.replace(/^\//, '');
  if (fileMap[noLeadingSlash]) return fileMap[noLeadingSlash];
  return null;
}

function cleanFrontmatter(content) {
  return content.replace(/^---\n([\s\S]*?)---\n/, (match, frontmatter) => {
    let cleaned = frontmatter.replace(/^aliases:\n(\s+- .*\n?)*/gm, '');
    cleaned = cleaned.trim();
    if (!cleaned) return '';
    return `---\n${cleaned}\n---\n`;
  });
}

function removeDataviewBlocks(content) {
  const regex = /```dataview[\s\S]*?```/g;
  const matches = content.match(regex);
  if (matches) stats.dataviewBlocksRemoved += matches.length;
  return content.replace(regex, '');
}

function convertEmbeds(content, sourceDir) {
  return content.replace(/!\[\[([^\]]+)\]\]/g, (_match, target) => {
    const targetPath = path.join(sourceDir, target + '.md');
    if (fs.existsSync(targetPath)) {
      stats.embedsResolved++;
      return fs.readFileSync(targetPath, 'utf-8').trim();
    }
    stats.externalWikilinks++;
    return target;
  });
}

function convertWikilinks(content, fileMap) {
  content = content.replace(/\[\[([^\|\]]+)\|([^\]]+)\]\]/g, (_match, target, alias) => {
    const resolved = resolveWikilink(target, fileMap);
    if (resolved) {
      stats.wikilinksConverted++;
      return `[${alias}](/patioz-docs/${resolved})`;
    }
    stats.externalWikilinks++;
    return alias;
  });

  content = content.replace(/\[\[([^\]]+)\]\]/g, (_match, target) => {
    const resolved = resolveWikilink(target, fileMap);
    if (resolved) {
      stats.wikilinksConverted++;
      return `[${target}](/patioz-docs/${resolved})`;
    }
    stats.externalWikilinks++;
    return target;
  });

  return content;
}

function main() {
  console.log('Source:', SOURCE_DIR);
  console.log('Target:', TARGET_DIR);
  console.log('');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error('ERROR: Source not found:', SOURCE_DIR);
    process.exit(1);
  }

  const fileMap = buildFileMap(SOURCE_DIR);
  const sourceFiles = walkDir(SOURCE_DIR);
  console.log(`Found ${sourceFiles.length} markdown files`);

  let categoryJson = null;
  const categoryPath = path.join(TARGET_DIR, '_category.json');
  if (fs.existsSync(categoryPath)) {
    categoryJson = fs.readFileSync(categoryPath, 'utf-8');
    console.log('Preserved _category.json');
  }

  if (fs.existsSync(TARGET_DIR)) {
    fs.rmSync(TARGET_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TARGET_DIR, { recursive: true });

  if (categoryJson) {
    fs.writeFileSync(path.join(TARGET_DIR, '_category.json'), categoryJson, 'utf-8');
  }

  for (const sourceFile of sourceFiles) {
    stats.filesFound++;
    const relativePath = path.relative(SOURCE_DIR, sourceFile);
    const targetFile = path.join(TARGET_DIR, relativePath);
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });

    let content = fs.readFileSync(sourceFile, 'utf-8');
    content = cleanFrontmatter(content);
    content = removeDataviewBlocks(content);
    content = convertEmbeds(content, SOURCE_DIR);
    content = convertWikilinks(content, fileMap);

    fs.writeFileSync(targetFile, content, 'utf-8');
    stats.filesWritten++;
  }

  console.log('');
  console.log('Done!');
  console.log(`  Files written:      ${stats.filesWritten}`);
  console.log(`  Wikilinks converted: ${stats.wikilinksConverted}`);
  console.log(`  External links:     ${stats.externalWikilinks}`);
  console.log(`  Embeds resolved:    ${stats.embedsResolved}`);
  console.log(`  Dataview removed:   ${stats.dataviewBlocksRemoved}`);
  console.log('');
  console.log('Output:', TARGET_DIR);
}

main();

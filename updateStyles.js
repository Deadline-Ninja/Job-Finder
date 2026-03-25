const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/pages/employer',
  'src/app/pages/job-seeker'
];

const matchRules = [
  // Typography
  { from: /font-\['Playfair_Display'\] font-bold text-\[#0F172A\]/g, to: "font-bold tracking-tight text-black" },
  { from: /font-\['Playfair_Display'\] text-\[#0F172A\]/g, to: "font-bold text-black" },
  { from: /font-\['Playfair_Display'\]/g, to: "font-bold tracking-tight" },
  { from: /text-\[#0F172A\]\/70/g, to: "text-[#6B7280]" },
  { from: /text-\[#0F172A\]\/60/g, to: "text-[#6B7280]" },
  { from: /text-\[#0F172A\]\/50/g, to: "text-gray-400" },
  { from: /text-\[#0F172A\]/g, to: "text-black" },
  { from: /text-\[#C9A227\]/g, to: "text-[#2563EB]" },
  // Backgrounds & effects
  { from: /bg-white\/60 backdrop-blur-md border border-white\/40/g, to: "bg-white border border-[#E5E7EB] shadow-sm" },
  { from: /bg-white\/80/g, to: "bg-white border border-[#E5E7EB]" },
  { from: /hover:shadow-xl transition-all/g, to: "hover:shadow-md transition-all" },
  { from: /bg-\[#C9A227\] hover:bg-\[#B89220\] text-white/g, to: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white" },
  { from: /bg-\[#C9A227\]/g, to: "bg-[#2563EB]" },
  { from: /border-\[#C9A227\] hover:bg-\[#C9A227\]/g, to: "border-[#2563EB] hover:bg-[#2563EB]" },
  { from: /border-\[#C9A227\]/g, to: "border-[#2563EB]" },
  { from: /fill="#C9A227"/g, to: 'fill="#2563EB"' },
  { from: /stroke="#C9A227"/g, to: 'stroke="#2563EB"' },
  { from: /text-\[#B89220\]/g, to: 'text-[#1D4ED8]' },

  // Gradients for Icons
  { from: /bg-gradient-to-br from-\[#C9A227\] to-\[#B89220\]([^>]+)>\s*<([A-Za-z]+) className="([^"]*)text-white"/g, to: 'bg-blue-50$1>\n                <$2 className="$3text-[#2563EB]"' },
  { from: /bg-gradient-to-br from-\[#0F172A\] to-\[#1E293B\]([^>]+)>\s*<([A-Za-z]+) className="([^"]*)text-white"/g, to: 'bg-blue-50$1>\n                <$2 className="$3text-[#2563EB]"' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      for (const rule of matchRules) {
        newContent = newContent.replace(rule.from, rule.to);
      }
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed', fullPath);
      }
    }
  }
}

for (const dir of dirs) {
  processDir(path.resolve(__dirname, dir));
}

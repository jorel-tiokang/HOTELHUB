import re

with open('/home/tioks/Desktop/hotelhub/src/components/DirectorDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i < 315:
        # Don't change header/sidebar text, but do change bg-[#0A0A0A]
        if 'bg-[#0A0A0A]' in line:
            line = line.replace('bg-[#0A0A0A]', 'bg-background')
        new_lines.append(line)
    else:
        # Replace white text with foreground
        line = line.replace('text-white', 'text-foreground')
        # Replace white backgrounds/borders with foreground
        line = line.replace('bg-white/', 'bg-foreground/')
        line = line.replace('border-white/', 'border-foreground/')
        line = line.replace('placeholder-white/', 'placeholder-foreground/')
        
        # In modals, the close button hover might be hover:bg-foreground/10
        # What about text-white/50 -> text-foreground/50? handled by text-white replacement
        new_lines.append(line)

with open('/home/tioks/Desktop/hotelhub/src/components/DirectorDashboard.tsx', 'w') as f:
    f.writelines(new_lines)

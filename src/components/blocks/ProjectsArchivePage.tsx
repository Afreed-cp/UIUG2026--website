import React from 'react';
import AppreciationMatrix from './AppreciationMatrix';

interface Project {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  link: string;
}

interface ProjectsArchivePageProps {
  projects: Project[];
}

const ProjectsArchivePage: React.FC<ProjectsArchivePageProps> = ({ projects }) => {
  // Split projects into left and right columns for zig-zag layout
  const leftColumn: Project[] = [];
  const rightColumn: Project[] = [];
  
  projects.forEach((project, index) => {
    if (index % 2 === 0) {
      leftColumn.push(project);
    } else {
      rightColumn.push(project);
    }
  });

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Top Meta Bar */}
      <div className="w-full bg-black text-white py-1 px-4 hidden md:flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-gray-400">
        <div className="flex gap-4">
          <span>Kerala_Umbraco_KUG_v.2.0.4</span>
          <span>|</span>
          <span>Project_Showcase_Archive</span>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-terminal-red cursor-pointer transition-colors">[01] Directory</span>
          <span className="hover:text-terminal-red cursor-pointer transition-colors">[02] Console</span>
          <a href="/" className="hover:text-terminal-red cursor-pointer transition-colors">[X] EXIT_VIEW</a>
        </div>
      </div>

      {/* Main Header */}
      <header className="px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Project_Showcase
          </h1>
          <p className="mt-4 text-xs font-mono text-gray-500 max-w-xl lowercase">
            Displaying full repository nodes. asynchronous zig-zag layout protocol v.2.04 initialized.
          </p>
        </div>
        <div className="flex gap-4">
          <a 
            href="/"
            className="border-2 border-black px-8 py-4 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all"
          >
            [ CLOSE ]
          </a>
        </div>
      </header>

      {/* Zig Zag Content Grid */}
      <main className="px-4 md:px-8 py-8 md:py-16 max-w-[1600px] mx-auto flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-start mb-12 md:mb-24">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8 md:gap-16 lg:gap-32">
            {leftColumn.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </div>

          {/* Right Column (Offset for Zig-Zag effect) */}
          <div className="flex flex-col gap-8 md:gap-16 lg:gap-32 lg:mt-48">
            {rightColumn.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* APPRECIATION MATRIX AT BOTTOM */}
        <div className="mt-12 md:mt-24 lg:mt-32">
          <div className="mb-6 md:mb-8 border-l-4 border-black pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">Cluster_Appreciation_Uplink</h2>
            <p className="text-xs font-mono text-gray-400 lowercase italic mt-2">Identify and appreciate the individual nodes responsible for the Kerala backbone.</p>
          </div>
          <AppreciationMatrix />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 py-12 px-8 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase text-gray-400">
          <div className="mb-4 md:mb-0">
            <span>© 2024 The_Kerala_Umbraco_KUG</span>
            <span className="mx-2 opacity-30">|</span>
            <span>Zig_Zag_Variant_Showcase</span>
          </div>
          <div className="flex gap-8">
            <a className="hover:text-terminal-red transition-colors" href="#">GH_REPO</a>
            <a className="hover:text-terminal-red transition-colors" href="#">TR_FEED</a>
            <a href="/" className="text-terminal-red font-bold underline">BACK_TO_DASHBOARD</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ProjectCard: React.FC<{ item: Project }> = ({ item }) => (
  <article className="group relative flex flex-col border border-black bg-white hover:shadow-[16px_16px_0px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden">
    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
      {item.imageUrl ? (
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xs font-black">NO_IMAGE</span>
        </div>
      )}
      {/* Visual flair corners */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-terminal-red text-xl status-blink">⚡</span>
      </div>
    </div>
    
    <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-4 md:gap-6">
      <div>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4 tracking-tighter leading-none italic uppercase">
          {item.title}
        </h3>
        <p className="text-gray-600 font-mono text-xs leading-relaxed lowercase italic">
          {item.description}
        </p>
      </div>
      
      <div className="mt-auto pt-6 md:pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-[10px] font-bold uppercase tracking-widest">
        <a 
          href={item.link} 
          target={item.link.startsWith('http') ? '_blank' : undefined}
          rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-2 hover:text-terminal-red transition-colors group/link font-black"
        >
          VISIT_PROJECT_NODE <span className="group-hover/link:translate-x-1 transition-transform">{'>>>'}</span>
        </a>
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-[8px] text-gray-400">CONTRIBUTED_BY</span>
          <span className="bg-gray-50 px-3 py-1 border border-gray-100">DEV: {item.author}</span>
        </div>
      </div>
    </div>

    {/* Vertical Bar on hover */}
    <div className="absolute right-0 top-0 w-2 h-0 bg-terminal-red group-hover:h-full transition-all duration-500"></div>
  </article>
);

export default ProjectsArchivePage;


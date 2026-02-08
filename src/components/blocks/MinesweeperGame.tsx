import React, { useState, useEffect, useCallback } from 'react';

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
};

interface MinesweeperGameProps {
  title?: string;
  gameTitle?: string;
  gameDescription?: string;
  missionObjective?: string;
  rebootButtonText?: string;
  gridRows?: number;
  gridCols?: number;
  mineCount?: number;
}

const MinesweeperGame: React.FC<MinesweeperGameProps> = ({ 
  title = 'NODE_SAFETY_PROTOCOL_v1.2',
  gameTitle = 'CLEANSE_THE\nCLUSTER.',
  gameDescription = 'directive — identify legacy glitches hidden within the node array. left-click to scan a node. right-click to deploy a [HEART_SHIELD]. secure all stable nodes to synchronize.',
  missionObjective = 'NEUTRALIZE_ALL_SAFE_NODES',
  rebootButtonText = '[ REBOOT_SIMULATION ]',
  gridRows = 8,
  gridCols = 12,
  mineCount = 15
}) => {
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'WON' | 'LOST'>('IDLE');
  const [flagsUsed, setFlagsUsed] = useState(0);

  // Initialize the game grid
  const initGame = useCallback(() => {
    // 1. Create empty grid
    const newGrid: CellState[][] = Array(gridRows).fill(null).map(() =>
      Array(gridCols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
      }))
    );

    // 2. Place mines randomly
    let placedMines = 0;
    while (placedMines < mineCount) {
      const r = Math.floor(Math.random() * gridRows);
      const c = Math.floor(Math.random() * gridCols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placedMines++;
      }
    }

    // 3. Calculate neighbor counts
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < gridRows && c + j >= 0 && c + j < gridCols) {
                if (newGrid[r + i][c + j].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborCount = count;
        }
      }
    }

    setGrid(newGrid);
    setGameState('PLAYING');
    setFlagsUsed(0);
  }, [gridRows, gridCols, mineCount]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const revealCell = (r: number, c: number) => {
    if (gameState !== 'PLAYING' || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    const newGrid = [...grid.map(row => [...row])];

    if (newGrid[r][c].isMine) {
      // Game Over
      setGameState('LOST');
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
    } else {
      // Flood fill if 0
      const flood = (row: number, col: number) => {
        if (row < 0 || row >= gridRows || col < 0 || col >= gridCols || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
        newGrid[row][col].isRevealed = true;
        if (newGrid[row][col].neighborCount === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              flood(row + i, col + j);
            }
          }
        }
      };
      flood(r, c);
    }

    setGrid(newGrid);
    checkWinCondition(newGrid);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== 'PLAYING' || grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    const currentlyFlagged = newGrid[r][c].isFlagged;
    newGrid[r][c].isFlagged = !currentlyFlagged;
    
    setFlagsUsed(prev => currentlyFlagged ? prev - 1 : prev + 1);
    setGrid(newGrid);
  };

  const checkWinCondition = (currentGrid: CellState[][]) => {
    let unrevealedSafeCells = 0;
    currentGrid.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafeCells++;
    }));

    if (unrevealedSafeCells === 0) {
      setGameState('WON');
    }
  };

  return (
    <>
      {/* Header Bar */}
      <div className="p-3 sm:p-4 bg-terminal-gray/20 cell-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-terminal-gray">
        <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-terminal-red text-terminal-red text-[8px] sm:text-[10px]">PLS</span>
          <span className="break-words">{title}</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[8px] sm:text-[9px] font-bold text-terminal-gray uppercase">
          <span className={`${gameState === 'PLAYING' ? 'status-blink text-terminal-red' : 'text-terminal-white'} tracking-widest`}>
            ● STATUS: {gameState}
          </span>
          <span className="hidden sm:inline">SHIELDS_DEPLOYED: {flagsUsed} / {mineCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-terminal-gray bg-terminal-gray/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-terminal-red font-black tracking-[0.2em] uppercase mb-2 block">/GAME_INTERFACE</span>
            <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase mb-4 sm:mb-6 leading-none whitespace-pre-line break-words">
              {gameTitle}
            </h3>
            {gameDescription && (
              <p className="text-[10px] font-mono text-terminal-gray leading-relaxed lowercase italic mb-8">
                {gameDescription}
              </p>
            )}
            
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-terminal-gray/30 pb-2">
                <span className="text-[9px] font-bold text-terminal-gray uppercase">Mission_Objective</span>
                <span className="text-xs font-black text-terminal-white">{missionObjective}</span>
              </div>
              <button 
                onClick={initGame}
                className="w-full mt-4 bg-terminal-white text-terminal-black py-3 font-black text-xs hover:bg-terminal-red hover:text-white transition-all shadow-[4px_4px_0px_#333]"
              >
                {rebootButtonText}
              </button>
            </div>
          </div>

          <div className="mt-8">
             {gameState === 'LOST' && (
               <div className="p-3 border-2 border-terminal-red bg-terminal-red/10 font-black text-[10px] text-terminal-red uppercase tracking-[0.2em] text-center animate-pulse">
                  CRITICAL_FAILURE: GLITCH_DETONATED
               </div>
             )}
             {gameState === 'WON' && (
               <div className="p-3 border-2 border-white bg-white/10 font-black text-[10px] text-white uppercase tracking-[0.2em] text-center">
                  CLUSTER_SECURED: SYNCHRONIZATION_COMPLETE
               </div>
             )}
          </div>
        </div>

        {/* Right Grid (The Minesweeper) */}
        <div className="lg:col-span-8 p-3 sm:p-4 md:p-6 lg:p-8 bg-terminal-black overflow-x-auto">
          <div 
            className="grid gap-1 mx-auto" 
            style={{ 
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              width: '100%',
              maxWidth: '600px'
            }}
          >
            {grid.map((row, r) => row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
                className={`aspect-square border flex items-center justify-center transition-all duration-150 relative group/tile overflow-hidden text-[10px] font-black
                  ${cell.isRevealed 
                    ? (cell.isMine ? 'bg-terminal-red border-terminal-red' : 'bg-terminal-gray/20 border-terminal-gray/40') 
                    : 'bg-terminal-gray/5 border-terminal-gray hover:border-terminal-white/50 hover:bg-terminal-white/5'}
                `}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <span className="text-white text-xs">☢</span>
                  ) : (
                    cell.neighborCount > 0 ? (
                      <span style={{ color: ['#666', '#FF0000', '#FF3333', '#FF6666', '#FF9999'][cell.neighborCount] || '#fff' }}>
                        {cell.neighborCount}
                      </span>
                    ) : null
                  )
                ) : cell.isFlagged ? (
                  <svg className="w-3 h-3 fill-terminal-red drop-shadow-[0_0_3px_rgba(255,0,0,0.5)]" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : null}

                {/* Tactical Tile Corner Overlay */}
                {!cell.isRevealed && (
                   <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-terminal-white opacity-20"></div>
                )}
              </button>
            )))}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="text-[7px] font-mono text-terminal-gray uppercase tracking-widest border border-terminal-gray/20 px-2 py-1">
              [ GRID: {gridCols}x{gridRows} ]
            </div>
            <div className="text-[7px] font-mono text-terminal-gray uppercase tracking-widest border border-terminal-gray/20 px-2 py-1">
              [ PARITY: ENCRYPTED ]
            </div>
            <div className="text-[7px] font-mono text-terminal-red uppercase tracking-widest border border-terminal-red/20 px-2 py-1 status-blink">
              [ DANGER: {mineCount}_GLITCHES_DETECTION ]
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Data Strip */}
      <div className="p-2 border-t border-terminal-gray bg-terminal-gray/5 flex justify-center text-[7px] font-bold text-terminal-gray tracking-[0.5em] uppercase">
        {'CLEANSE_THE_ARRAY_TO_SECURE_THE_V14_BACKBONE_>>>_CLEANSE_THE_ARRAY'}
      </div>
    </>
  );
};

export default MinesweeperGame;


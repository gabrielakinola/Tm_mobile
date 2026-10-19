import { useEffect, useMemo, useState } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import QRCode from 'qrcode';

const PATTERN_SIZE = 13;
const PATTERN_CENTER = (PATTERN_SIZE - 1) / 2;
const CORE_RADIUS = 0;
const FINDER_SIZE = 7;
const QR_ROTATE_MS = 15_000;
const TOKEN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TOKEN_LENGTH = 16;

function createQrMatrix(value: string): number[][] {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'H' });
  const size = qr.modules.size;
  const data = qr.modules.data;
  const matrix: number[][] = [];

  for (let row = 0; row < size; row += 1) {
    const next: number[] = [];
    for (let col = 0; col < size; col += 1) {
      next.push(data[row * size + col] ? 1 : 0);
    }
    matrix.push(next);
  }

  fillCornerFindersWithQrModules(matrix);
  stampCenterAlignmentPattern(matrix);
  return matrix;
}

function fillCornerFindersWithQrModules(matrix: number[][]): void {
  const size = matrix.length;
  const cornerSize = FINDER_SIZE + 1;
  const sampleOrigin = cornerSize;
  const sampleSpan = size - sampleOrigin * 2;

  if (sampleSpan <= 0) {
    return;
  }

  const origins: [number, number][] = [
    [0, 0],
    [0, size - cornerSize],
    [size - cornerSize, 0],
  ];

  origins.forEach(([row0, col0], cornerIndex) => {
    for (let y = 0; y < cornerSize; y += 1) {
      for (let x = 0; x < cornerSize; x += 1) {
        const srcRow = sampleOrigin + ((y + cornerIndex * 3) % sampleSpan);
        const srcCol = sampleOrigin + ((x + cornerIndex * 5) % sampleSpan);
        matrix[row0 + y][col0 + x] = matrix[srcRow][srcCol];
      }
    }
  });
}

function stampCenterAlignmentPattern(matrix: number[][]): void {
  const size = matrix.length;
  if (size < PATTERN_SIZE) {
    return;
  }

  const start = Math.floor((size - PATTERN_SIZE) / 2);

  for (let y = 0; y < PATTERN_SIZE; y += 1) {
    for (let x = 0; x < PATTERN_SIZE; x += 1) {
      matrix[start + y][start + x] = isAlignmentModuleBlack(x, y) ? 1 : 0;
    }
  }
}

function isAlignmentModuleBlack(x: number, y: number): boolean {
  const dist = Math.max(Math.abs(x - PATTERN_CENTER), Math.abs(y - PATTERN_CENTER));
  return dist <= CORE_RADIUS || (PATTERN_CENTER - dist) % 2 === 0;
}

function matrixToPath(matrix: number[][], size: number): { path: string; cellSize: number } {
  const cellSize = size / matrix.length;
  let path = '';

  matrix.forEach((row, i) => {
    let drawing = false;
    row.forEach((module, j) => {
      if (module) {
        if (!drawing) {
          path += `M${cellSize * j} ${cellSize / 2 + cellSize * i} `;
          drawing = true;
        }
        if (drawing && j === matrix.length - 1) {
          path += `L${cellSize * (j + 1)} ${cellSize / 2 + cellSize * i} `;
        }
      } else if (drawing) {
        path += `L${cellSize * j} ${cellSize / 2 + cellSize * i} `;
        drawing = false;
      }
    });
  });

  return { path, cellSize };
}

export function TicketQrCode({ value, size }: { value: string; size: number }) {
  const [token, setToken] = useState(createQrToken);

  useEffect(() => {
    const interval = setInterval(() => {
      setToken(createQrToken());
    }, QR_ROTATE_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const payload = `${value}:${token}`;
  const { path, cellSize } = useMemo(
    () => matrixToPath(createQrMatrix(payload), size),
    [payload, size],
  );

  return (
    <Svg key={token} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect width={size} height={size} fill="#FFFFFF" />
      <Path d={path} stroke="#000000" strokeWidth={cellSize} strokeLinecap="butt" />
    </Svg>
  );
}

function createQrToken(): string {
  let token = '';
  for (let i = 0; i < TOKEN_LENGTH; i += 1) {
    token += TOKEN_ALPHABET[Math.floor(Math.random() * TOKEN_ALPHABET.length)];
  }
  return token;
}

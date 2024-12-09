'use client';

import { useState, useEffect, useRef } from 'react';

const SAMPLE_TEXTS = [
  {
    id: 1,
    title: "Будущее технологий",
    text: "Искусственный интеллект и машинное обучение революционизируют нашу жизнь и работу. От беспилотных автомобилей до умных домашних устройств, технологии продолжают развиваться с беспрецедентной скоростью. Интеграция ИИ в повседневные приложения создает новые возможности и вызовы для общества."
  },
  {
    id: 2,
    title: "Исследование океана",
    text: "Глубоко под поверхностью океана лежит мир тайн и чудес. Морские ученые открывают новые виды и экосистемы, которые бросают вызов нашему пониманию жизни на Земле. Глубокое море остается одним из наиболее изученных рубежей на нашей планете."
  },
  {
    id: 3,
    title: "Космические путешествия",
    text: "Поскольку частные компании присоединяются к космическим агентствам в гонке за исследование космоса, мечта о межпланетных путешествиях становится ближе к реальности. Планируются миссии на Марс, разрабатываются лунные базы. Следующее десятилетие может стать первым шагом человечества к тому, чтобы стать мультипланетным видом."
  },
  {
    id: 4,
    title: "Изменение климата",
    text: "Глобальные температуры продолжают расти, влияя на экосистемы по всему миру. Ученые предупреждают, что необходимы немедленные действия для предотвращения необратимого ущерба нашей планете. Внедрение возобновляемых источников энергии и устойчивых практик становится все более важным в борьбе с изменением климата."
  },
  {
    id: 5,
    title: "Человеческий мозг",
    text: "Нейробиологи делают прорывные открытия о работе нашего мозга. Новые исследования раскрывают сложность нейронных сетей и сознания. Понимание человеческого мозга может привести к лечению различных неврологических состояний и достижениям в области искусственного интеллекта."
  }
];

export function SpeedReader() {
  const [selectedText, setSelectedText] = useState(SAMPLE_TEXTS[0]);
  const [speed, setSpeed] = useState(200);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [position, setPosition] = useState(0);
  
  // Предустановленные скорости
  const speedPresets = [
    { label: 'Медленно', value: 200 },
    { label: 'Средне', value: 500 },
    { label: 'Быстро', value: 1000 },
    { label: 'Очень быстро', value: 2000 },
    { label: 'Максимум', value: 3000 }
  ];
  
  const textRef = useRef<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    textRef.current = selectedText.text;
    setPosition(0);
    setDisplayText(textRef.current);
  }, [selectedText]);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 * 1000) / speed; // Конвертируем скорость в миллисекунды
      
      timerRef.current = setInterval(() => {
        setPosition(prev => {
          if (prev >= textRef.current.length) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed]);

  const handlePlayPause = () => {
    if (position >= textRef.current.length) {
      setPosition(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPosition(0);
  };

  const handleSpeedPreset = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="min-h-screen w-full flex justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center gap-6 md:gap-8">
        {/* Заголовок */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Тренажер скорочтения
        </h1>

        {/* Выбор текста */}
        <div className="w-full px-2 sm:px-4">
          <label className="block mb-2 text-sm md:text-base">Выберите текст:</label>
          <select 
            className="w-full p-2 md:p-3 border rounded dark:bg-gray-800 text-sm md:text-base"
            value={selectedText.id}
            onChange={(e) => {
              const selected = SAMPLE_TEXTS.find(t => t.id === Number(e.target.value));
              if (selected) {
                setIsPlaying(false);
                setSelectedText(selected);
              }
            }}
          >
            {SAMPLE_TEXTS.map(text => (
              <option key={text.id} value={text.id}>
                {text.title}
              </option>
            ))}
          </select>
        </div>

        {/* Управление скоростью */}
        <div className="w-full space-y-4 px-2 sm:px-4">
          <div>
            <label className="block mb-2 text-sm md:text-base">Предустановленные скорости:</label>
            <div className="flex flex-wrap gap-2">
              {speedPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleSpeedPreset(preset.value)}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded text-xs md:text-sm transition-colors ${
                    speed === preset.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm md:text-base">
              Точная настройка скорости ({speed} символов/мин):
            </label>
            <input 
              type="range"
              min="100"
              max="3000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Область отображения текста */}
        <div 
          ref={containerRef}
          className="w-full h-16 md:h-24 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg relative mx-2 sm:mx-4"
        >
          <div 
            className="whitespace-nowrap text-xl md:text-3xl font-medium p-4 md:p-6"
            style={{
              transform: `translateX(calc(-${position}ch))`,
              transition: 'transform 0.1s linear'
            }}
          >
            {displayText}
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex gap-3 md:gap-4">
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 md:px-6 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm md:text-base transition-colors"
          >
            {isPlaying ? 'Пауза' : 'Старт'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 md:px-6 md:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium text-sm md:text-base transition-colors"
          >
            Сброс
          </button>
        </div>

        {/* Полный текст */}
        <div className="w-full mt-4 md:mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded mx-2 sm:mx-4">
          <h3 className="font-bold mb-2 text-base md:text-lg">{selectedText.title}</h3>
          <p className="text-xs md:text-sm">{selectedText.text}</p>
        </div>
      </div>
    </div>
  );
} 
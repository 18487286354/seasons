        (function () {
            const weatherBtn = document.getElementById('weatherBtn');
            const widget = document.getElementById('weatherWidget');
            const closePanelBtn = document.getElementById('closePanelBtn');
            const retryBtn = document.getElementById('retryWeatherBtn');
            const weatherIcon = document.getElementById('weatherIcon');
            const temperature = document.getElementById('temperature');
            const weatherDesc = document.getElementById('weatherDesc');
            const locationText = document.getElementById('locationText');
            const humidityEl = document.getElementById('humidity');
            const windEl = document.getElementById('wind');
            const pressureEl = document.getElementById('pressure');
            const feelsLikeEl = document.getElementById('feelsLike');
            const precipProbEl = document.getElementById('precipProb');
            const uvIndexEl = document.getElementById('uvIndex');
            const sunriseTimeEl = document.getElementById('sunriseTime');
            const sunsetTimeEl = document.getElementById('sunsetTime');
            const updateTimeSpan = document.getElementById('updateTime');
            const lifeAdviceContainer = document.getElementById('lifeAdviceContainer');
            const lifeAdviceTextSpan = document.getElementById('lifeAdviceText');
            const forecastContainer = document.getElementById('forecastContainer');

            let isLoading = false;
            let currentController = null;

            // 自动滚动控制：若文字不超出则取消动画
            function adjustScrollAnimation() {
                if (!lifeAdviceTextSpan) return;
                const textWidth = lifeAdviceTextSpan.scrollWidth;
                const containerWidth = lifeAdviceContainer.clientWidth;
                if (textWidth <= containerWidth) {
                    lifeAdviceTextSpan.style.animation = 'none';
                    lifeAdviceTextSpan.style.transform = 'translateX(0)';
                    lifeAdviceTextSpan.style.padding = '0';
                    lifeAdviceTextSpan.style.display = 'block';
                    lifeAdviceTextSpan.style.textAlign = 'center';
                } else {
                    const currentText = lifeAdviceTextSpan.innerText;
                    if (!lifeAdviceTextSpan.hasAttribute('data-cloned')) {
                        lifeAdviceTextSpan.setAttribute('data-cloned', 'true');
                        lifeAdviceTextSpan.innerText = currentText + ' · ' + currentText;
                    }
                    lifeAdviceTextSpan.style.animation = 'scrollText 20s linear infinite';
                    lifeAdviceTextSpan.style.display = 'inline-block';
                    lifeAdviceTextSpan.style.textAlign = 'left';
                    lifeAdviceTextSpan.style.padding = '0 20px';
                }
            }

            // 工具函数
            function codeToEmoji(code) {
                const map = {
                    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
                    45: '🌫️', 48: '🌫️',
                    51: '🌦️', 53: '🌦️', 55: '🌦️',
                    56: '🌧️', 57: '🌧️',
                    61: '🌧️', 63: '🌧️', 65: '🌧️',
                    66: '🌧️', 67: '🌧️',
                    71: '❄️', 73: '❄️', 75: '❄️',
                    77: '❄️',
                    80: '🌧️', 81: '🌧️', 82: '🌧️',
                    85: '🌨️', 86: '🌨️',
                    95: '⛈️', 96: '⛈️', 99: '⛈️'
                };
                return map[code] || '🌈';
            }

            function getWeatherText(code) {
                const map = {
                    0: '晴天', 1: '大部晴朗', 2: '局部多云', 3: '多云',
                    45: '大雾', 48: '雾凇',
                    51: '小毛毛雨', 53: '毛毛雨', 55: '毛毛雨',
                    56: '冻毛毛雨', 57: '冻毛毛雨',
                    61: '小雨', 63: '中雨', 65: '大雨',
                    66: '小冻雨', 67: '冻雨',
                    71: '小雪', 73: '中雪', 75: '大雪',
                    77: '雪粒',
                    80: '阵雨', 81: '中阵雨', 82: '大阵雨',
                    85: '小阵雪', 86: '大阵雪',
                    95: '雷暴', 96: '雷暴冰雹', 99: '强雷暴冰雹'
                };
                return map[code] || '未知';
            }

            function uvLevelText(uvi) {
                if (uvi == null || isNaN(uvi)) return '--';
                if (uvi <= 2) return '低';
                if (uvi <= 5) return '中等';
                if (uvi <= 7) return '高';
                if (uvi <= 10) return '很高';
                return '极高';
            }

            function formatTime(date) {
                if (!date) return '--:--';
                return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
            }

            function formatDate(offsetDays) {
                const d = new Date();
                d.setDate(d.getDate() + offsetDays);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            }

            function toSimplifiedChinese(str) {
                if (!str) return str;
                const map = { '縣': '县', '區': '区', '鎮': '镇', '鄉': '乡', '巿': '市', '廣': '广', '東': '东', '西': '西', '南': '南', '北': '北', '壯': '壮', '爾': '尔', '發': '发', '尋': '寻' };
                let result = '';
                for (let char of str) result += map[char] || char;
                return result;
            }

            // 生活建议生成
            function generateLifeAdvice(temp, feelsLike, uv, weatherCode, precip, humidity) {
                const tips = [];
                const isRaining = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || (weatherCode >= 95 && weatherCode <= 99);
                const willRain = precip !== null && precip > 0.5;
                if (isRaining || willRain) tips.push('☔ 建议带伞，有雨');
                else tips.push('☀️ 无需带伞');

                if (uv !== null && uv > 5) tips.push('🧴 紫外线较强，建议涂防晒');
                else if (uv !== null && uv > 2) tips.push('🌤️ 紫外线中等，可酌情防晒');
                else tips.push('🌙 紫外线弱，无需防晒');

                const tempDiff = (temp !== null && feelsLike !== null) ? (temp - feelsLike) : 0;
                if (temp !== null && temp < 10) tips.push('🧣 气温偏低，注意保暖防感冒');
                else if (tempDiff > 5) tips.push('🍃 体感比气温冷，及时添衣防感冒');
                else if (temp !== null && (temp >= 10 && temp <= 20) && (humidity !== null && humidity > 70)) tips.push('💧 湿冷天气，注意预防感冒');
                else tips.push('✅ 感冒风险较低');

                if (temp !== null && temp > 28) tips.push('🥤 天气炎热，注意补水');
                if (humidity !== null && humidity > 75) tips.push('💨 湿度偏高，可适当除湿');

                const uniqueTips = [...new Map(tips.map(t => [t.split(' ')[0], t])).values()];
                return uniqueTips.join(' · ');
            }

            function setLoadingState() {
                weatherIcon.textContent = '⏳';
                temperature.innerHTML = '<span class="loading-indicator">--</span>°';
                weatherDesc.innerHTML = '<span class="loading-indicator">加载中...</span>';
                locationText.textContent = '📍 定位中...';
                humidityEl.textContent = '--%';
                windEl.textContent = '--km/h';
                pressureEl.textContent = '--hPa';
                feelsLikeEl.textContent = '--°';
                precipProbEl.textContent = '--mm';
                uvIndexEl.textContent = '--';
                sunriseTimeEl.textContent = '--:--';
                sunsetTimeEl.textContent = '--:--';
                updateTimeSpan.textContent = '⏳ 更新中';
                retryBtn.style.display = 'none';
                lifeAdviceTextSpan.innerText = '✨ 生成建议中...';
                lifeAdviceTextSpan.style.animation = 'none';
                lifeAdviceTextSpan.removeAttribute('data-cloned');
                forecastContainer.innerHTML = `
        <div class="forecast-day"><div class="forecast-date">--</div><div class="forecast-icon">⏳</div><div class="forecast-desc">--</div><div class="forecast-temp">--/--</div></div>
        <div class="forecast-day"><div class="forecast-date">--</div><div class="forecast-icon">⏳</div><div class="forecast-desc">--</div><div class="forecast-temp">--/--</div></div>
        <div class="forecast-day"><div class="forecast-date">--</div><div class="forecast-icon">⏳</div><div class="forecast-desc">--</div><div class="forecast-temp">--/--</div></div>
      `;
            }

            function setErrorState(message, showRetry = true) {
                weatherIcon.textContent = '😞';
                temperature.textContent = '--°';
                weatherDesc.textContent = message || '获取失败';
                locationText.textContent = '📍 请检查网络';
                updateTimeSpan.textContent = '❌ 请求失败';
                retryBtn.style.display = showRetry ? 'inline-flex' : 'none';
                lifeAdviceTextSpan.innerText = '⚠️ 无法获取天气建议';
                lifeAdviceTextSpan.style.animation = 'none';
                lifeAdviceTextSpan.removeAttribute('data-cloned');
                forecastContainer.innerHTML = '<div class="forecast-day">暂无预报</div><div class="forecast-day">暂无预报</div><div class="forecast-day">暂无预报</div>';
            }

            function renderForecast(dailyData) {
                if (!dailyData || !dailyData.time || dailyData.time.length < 3) return;
                const forecastHTML = [];
                for (let i = 0; i < 3; i++) {
                    const maxTemp = dailyData.temperature_2m_max?.[i];
                    const minTemp = dailyData.temperature_2m_min?.[i];
                    const weatherCode = dailyData.weather_code?.[i];
                    const icon = codeToEmoji(weatherCode);
                    const weatherText = getWeatherText(weatherCode);
                    const dateLabel = i === 0 ? '今天' : (i === 1 ? '明天' : '后天');
                    const dateShow = formatDate(i);
                    forecastHTML.push(`
          <div class="forecast-day">
            <div class="forecast-date">${dateLabel}<br><span style="font-size:10px; opacity:0.7;">${dateShow}</span></div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-desc">${weatherText}</div>
            <div class="forecast-temp"><span>${maxTemp ?? '--'}</span>° / ${minTemp ?? '--'}°</div>
          </div>
        `);
                }
                forecastContainer.innerHTML = forecastHTML.join('');
            }

            function closePanel() {
                widget.classList.remove('show');
                if (currentController) {
                    currentController.abort();
                    currentController = null;
                }
                isLoading = false;
            }

            function openPanel() {
                widget.classList.add('show');
                if (!isLoading) fetchWeatherData();
            }

            weatherBtn.addEventListener('click', () => {
                if (!widget.classList.contains('show')) openPanel();
            });
            closePanelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closePanel();
            });
            retryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isLoading) return;
                fetchWeatherData();
            });
            widget.addEventListener('click', (e) => e.stopPropagation());

            async function fetchWeatherData() {
                if (isLoading) return;
                if (!widget.classList.contains('show')) return;
                if (currentController) currentController.abort();
                currentController = new AbortController();
                const signal = currentController.signal;
                isLoading = true;
                setLoadingState();

                if (!navigator.geolocation) {
                    setErrorState('浏览器不支持定位', false);
                    isLoading = false;
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;
                        try {
                            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,uv_index,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia%2FShanghai`;
                            const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`;

                            const [weatherRes, geoRes] = await Promise.all([
                                fetch(weatherUrl, { signal }),
                                fetch(geoUrl, { signal }).catch(() => null)
                            ]);
                            if (!weatherRes.ok) throw new Error(`天气API错误 ${weatherRes.status}`);
                            const weatherData = await weatherRes.json();

                            let cityName = '';
                            if (geoRes && geoRes.ok) {
                                const geoData = await geoRes.json();
                                const parts = [geoData.principalSubdivision, geoData.city, geoData.locality].filter(Boolean);
                                if (parts.length) cityName = [...new Set(parts)].join(' · ');
                                cityName = toSimplifiedChinese(cityName);
                            }
                            if (!cityName) cityName = '当前位置';

                            const current = weatherData.current;
                            if (!current) throw new Error('无当前数据');
                            const daily = weatherData.daily;

                            const temp = current.temperature_2m;
                            const humidity = current.relative_humidity_2m;
                            const feelsLike = current.apparent_temperature;
                            const wind = current.wind_speed_10m;
                            const pressure = current.surface_pressure;
                            const uvRaw = current.uv_index;
                            const code = current.weather_code;
                            const precip = current.precipitation;

                            let sunriseStr = '--:--', sunsetStr = '--:--';
                            if (daily?.sunrise?.[0] && daily?.sunset?.[0]) {
                                sunriseStr = formatTime(new Date(daily.sunrise[0]));
                                sunsetStr = formatTime(new Date(daily.sunset[0]));
                            }

                            if (!widget.classList.contains('show')) {
                                isLoading = false;
                                return;
                            }

                            const emoji = codeToEmoji(code);
                            weatherIcon.textContent = emoji;
                            temperature.textContent = `${temp ?? '--'}°`;
                            weatherDesc.textContent = `${emoji} ${getWeatherText(code)}`;
                            locationText.textContent = `📍 ${cityName}`;
                            humidityEl.textContent = `${humidity ?? '--'}%`;
                            windEl.textContent = `${wind ?? '--'}km/h`;
                            pressureEl.textContent = `${pressure ?? '--'}hPa`;
                            feelsLikeEl.textContent = `${feelsLike ?? '--'}°`;
                            precipProbEl.textContent = precip != null ? `${precip}mm` : '--mm';
                            uvIndexEl.textContent = uvLevelText(uvRaw);
                            sunriseTimeEl.textContent = sunriseStr;
                            sunsetTimeEl.textContent = sunsetStr;
                            updateTimeSpan.textContent = `🕐本次更新于 ${formatTime(new Date())}`;
                            weatherBtn.textContent = emoji;

                            const advice = generateLifeAdvice(temp, feelsLike, uvRaw, code, precip, humidity);
                            lifeAdviceTextSpan.innerText = advice;
                            lifeAdviceTextSpan.removeAttribute('data-cloned');
                            setTimeout(adjustScrollAnimation, 50);

                            if (daily) renderForecast(daily);
                            else forecastContainer.innerHTML = '<div class="forecast-day">暂无预报</div><div class="forecast-day">暂无预报</div><div class="forecast-day">暂无预报</div>';

                            retryBtn.style.display = 'none';
                            isLoading = false;
                            currentController = null;
                        } catch (error) {
                            if (error.name === 'AbortError') {
                                isLoading = false;
                                return;
                            }
                            console.error(error);
                            if (widget.classList.contains('show')) setErrorState('⚠️ 天气获取失败，请重试', true);
                            isLoading = false;
                            currentController = null;
                        }
                    },
                    (error) => {
                        console.warn(error);
                        if (widget.classList.contains('show')) {
                            let msg = '定位失败';
                            if (error.code === 1) msg = '请允许定位权限';
                            else if (error.code === 2) msg = '无法获取位置';
                            else if (error.code === 3) msg = '定位超时（可重试）';
                            setErrorState(msg, error.code !== 1);
                            locationText.textContent = '📍 定位被拒绝或不可用';
                        }
                        isLoading = false;
                        currentController = null;
                    },
                    { enableHighAccuracy: true, maximumAge: 60000 }
                );
            }

            window.addEventListener('beforeunload', () => {
                if (currentController) currentController.abort();
            });
            window.addEventListener('resize', () => {
                if (widget.classList.contains('show') && lifeAdviceTextSpan.innerText && !lifeAdviceTextSpan.innerText.includes('加载中')) {
                    adjustScrollAnimation();
                }
            });
            console.log('🌤️ 天气组件 - 日出日落纯文本无样式');
        })();
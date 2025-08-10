import { computed, type ComputedRef } from 'vue'
import type { ISourceOptions } from '@tsparticles/engine'

export interface ParticleTheme {
  isDark: boolean
}

export function useParticles(theme: ComputedRef<ParticleTheme>) {
  const baseOptions = computed((): ISourceOptions => ({
    background: {
      color: {
        value: 'transparent'
      }
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push'
        },
        onHover: {
          enable: true,
          mode: 'repulse'
        },
        resize: true
      },
      modes: {
        push: {
          quantity: 2
        },
        repulse: {
          distance: 100,
          duration: 0.4
        }
      }
    },
    particles: {
      color: {
        value: theme.value.isDark ? '#ffffff' : '#64748b'
      },
      links: {
        color: theme.value.isDark ? '#ffffff' : '#64748b',
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce'
        },
        random: false,
        speed: 1,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 50
      },
      opacity: {
        value: 0.3,
        random: {
          enable: true,
          minimumValue: 0.1
        },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      shape: {
        type: 'circle'
      },
      size: {
        value: { min: 1, max: 3 },
        random: {
          enable: true,
          minimumValue: 1
        },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 1,
          sync: false
        }
      }
    },
    detectRetina: true,
    smooth: true,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true
  }))

  const enhancedOptions = computed((): ISourceOptions => ({
    ...baseOptions.value,
    particles: {
      ...baseOptions.value.particles,
      number: {
        ...baseOptions.value.particles?.number,
        value: 80
      },
      move: {
        ...baseOptions.value.particles?.move,
        speed: 2
      },
      links: {
        ...baseOptions.value.particles?.links,
        opacity: 0.4
      }
    },
    interactivity: {
      ...baseOptions.value.interactivity,
      modes: {
        ...baseOptions.value.interactivity?.modes,
        push: {
          quantity: 4
        },
        repulse: {
          distance: 150,
          duration: 0.6
        }
      }
    }
  }))

  const createBurstEffect = (container: any) => {
    if (!container) return
    
    // 临时增加粒子数量创造爆发效果
    container.addParticle({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2
    })
  }

  return {
    baseOptions,
    enhancedOptions,
    createBurstEffect
  }
}
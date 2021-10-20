# EMS telegrams offsets for the device type Boiler

```
0x6DC CascadeMessage
 burnWorkMin 3

0x10 UBAErrorMessage1
0x11 UBAErrorMessage2
 codeNo, 2

0x14 UBATotalUptime
 UBAuptime 0, 3

0x15 UBAMaintenanceData
 maintenanceType 0
 time 1

0x1C UBAMaintenanceStatus
 message_code, 5

0x18 UBAMonitorFast
 selFlowTemp 0
 curFlowTemp 1
 selBurnPow 3
 curBurnPow 4
 boilerState 5
 burnGas 7, 0
 fanWork 7, 2
 ignWork 7, 3
 heatingPump 7, 5
 wwHeat 7, 6
 wwCirc 7, 7
 wwStorageTemp1 9
 wwStorageTemp2 11
 retTemp 13
 flameCurr 15
 sysPress 17
 serviceCode, 18 + 19
 serviceCodeNumber 20

0x19 UBAMonitorSlow
 outdoorTemp 0
 boilTemp 2
 exhaustTemp 4
 switchTemp 25
 heatingPumpMod 9
 burnStarts 10, 3
 burnWorkMin 13, 3
 heatWorkMin 19, 3

0x1A UBASetPoints
 setFlowTemp 0
 setBurnPow 1
 wwSetPumpPower 2

0x35 UBAFlags

0x16 UBAParameters
 heatingActivated 0
 heatingTemp 1
 burnMaxPower 2
 burnMinPower 3
 boilHystOff 4
 boilHystOn 5
 burnMinPeriod 6
 pumpDelay 8
 pumpModMax 9
 pumpModMin 10

0x33 UBAParameterWW
 wwActivated 1
 wwSelTemp 2
 wwHystOn 3
 wwHystOff 4
 wwFlowTempOffset 5
 wwCircPump 6
 wwCircMode 7
 wwDisinfectionTemp 8
 wWChargeType 10, 0

0x34 UBAMonitorWW
 wwSetTemp 0
 wwCurTemp 1
 wwCurTemp2 3
 wwType 8
 wwCurFlow 9
 wwWorkM 10, 3
 wWStarts 13, 3
 wwOneTime 5, 1
 wwDisinfecting 5, 2
 wwCharging 5, 3
 wwRecharging 5, 4
 wwTempOK 5, 5
 wwActive 5, 6

0x26 UBASettingsWW
 wwMaxPower 7

0x2A MC110Status
 wwMixerTemp 14
 wwTankMiddleTemp 18

0xD1 UBAOutdoorTemp
 outdoorTemp 0

0xE3 UBAMonitorSlowPlus2
 heatingPump2Mod 13

0xE4 UBAMonitorFastPlus
 selFlowTemp 6
 burnGas 11, 0
 wwHeat 11, 2
 curBurnPow 10
 selBurnPow 9
 curFlowTemp 7
 flameCurr 19
 retTemp 17
 sysPress 21
 serviceCode, 2 + 3
 serviceCodeNumber 4

0xE5 UBAMonitorSlowPlus
 fanWork 2, 2
 ignWork 2, 3
 heatingPump 2, 5
 wwCirc 2, 7
 exhaustTemp 6
 burnStarts 10, 3
 burnWorkMin 13, 3
 heatWorkMin 19, 3
 heatingPumpMod 25

0xE6 UBAParametersPlus
 heatingActivated 0
 heatingTemp 1
 burnMaxPower 4
 burnMinPower 5
 boilHystOff 8
 boilHystOn 9
 burnMinPeriod 10

0xE9 UBAMonitorWWPlus
 wwSetTemp 0
 wwCurTemp 1
 wwCurTemp2 3
 wwWorkM 14, 3
 wwOneTime 12, 2
 wwDisinfecting 12, 3
 wwCharging 12, 4
 wwRecharging 13, 4
 wwTempOK 13, 5
 wwCirc 13, 2
 wwSelTemp 10
 wwDisinfectionTemp 9

0xEA UBAParameterWWPlus
 wwActivated 5
 wwCircPump 10
 wwCircMode 11
 wwHystOn 7
 wwHystOff 8

0x494 UBAEnergySupplied
 nrgSuppTotal 4
 nrgSuppHeating 12
 nrgSuppWw 8
 nrgSuppCooling 16

0x495 UBAInformation
 upTimeControl 0
 upTimeCompHeating 8
 upTimeCompCooling 16
 upTimeCompWw 4
 heatingStarts 28
 coolingStarts 36
 wwStarts2 24
 nrgConsTotal 64
 auxElecHeatNrgConsTotal 40
 auxElecHeatNrgConsHeating 48
 auxElecHeatNrgConsWW 44
 nrgConsCompTotal 56
 nrgConsCompHeating 68
 nrgConsCompWw 72
 nrgConsCompCooling 76

0x48D HpPower
 hpPower 11

0x48F HpOutdoor
 hpTc0 6
 hpTc1 4
 hpTc3 2
 hpTr3 16
 hpTr4 18
 hpTr5 20
 hpTr6 0
 hpTr7 30
 hpTl2 12
 hpPl1 26
 hpPh1 28

```

### Name description

```
      wwSetTemp          = Warm Water set temperature
      wwSelTemp          = Warm Water selected temperature
      wwType             = 0-off, 1-flow, 2-flowbuffer, 3-buffer, 4-layered buffer
      wwComfort          = WW comfort mode
      wwCircPump         = Warm Water circulation pump available
      wWChargeType       = Warm Water charge type (pump or 3-way-valve)
      wwDisinfectionTemp = Warm Water disinfection temperature to prevent infection
      wwCircMode         = Warm Water circulation pump mode
      wwCirc             = Circulation on/off
      wwCurTemp          = Warm Water current temperature
      wwCurTemp2         = Warm Water current temperature storage
      wwCurFlow          = Warm Water current flow temp in l/min
      wwStorageTemp1     = warm water storage temp 1
      wwStorageTemp2     = warm water storage temp 2
      wwActivated        = Warm Water activated
      wwOneTime          = Warm Water one time function on/off
      wwDisinfecting     = Warm Water disinfection on/off
      wwCharging         = Warm Water charging on/off
      wwRecharging       = Warm Water recharge on/off
      wwTempOK           = Warm Water temperature ok on/off
      wwActive           =
      wwHeat             = 3-way valve on WW
      wwSetPumpPower     = ww pump speed/power?
      wwFlowTempOffset   = Boiler offset for ww heating
      wwMaxPower         = Warm Water maximum power
      wWStarts           = Warm Water # starts
      wwStarts2          = Warm water control starts
      wwWorkM            = Warm Water # minutes
      wwHystOn
      wwHystOff
      wwTapActivated   = maintenance-mode to switch DHW off
      wwMixerTemp      = mixing temperature
      wwTankMiddleTemp = Tank middle temperature (TS3)
      heatingActive    = Central heating is on/off
      tapwaterActive   = Hot tap water is on/off
      selFlowTemp      = Selected flow temperature
      selBurnPow       = Burner max power %
      heatingPump2Mod  = heatpump modulation from 0xE3 (heatpumps)
      heatingPumpMod   = Pump modulation %
      outdoorTemp      = Outside temperature
      curFlowTemp      = Current flow temperature
      retTemp          = Return temperature
      switchTemp       = Switch temperature
      sysPress         = System pressure
      boilTemp         = Boiler temperature
      exhaustTemp      = Exhaust temperature
      burnGas          = Gas on/off
      flameCurr        = Flame current in micro amps
      heatingPump      = Boiler heating pump on/off
      fanWork          = Fan on/off
      ignWork          = Ignition on/off
      heatingActivated = Heating activated on the boiler
      heatingTemp      = Heating temperature setting on the boiler
      pumpModMax       = Boiler circuit pump modulation max. power %
      pumpModMin       = Boiler circuit pump modulation min. power
      pumpDelay
      burnMinPeriod
      burnMinPower
      burnMaxPower
      boilHystOn
      boilHystOff
      setFlowTemp       = boiler setpoint temp
      curBurnPow        = Burner current power %
      setBurnPow        = max output power in %
      burnStarts        = # burner restarts
      burnWorkMin       = Total burner operating time
      heatWorkMin       = Total heat operating time
      UBAuptime         = Total UBA working hours
      lastCode          = last error code
      serviceCode       = 3 character status/service code
      serviceCodeNumber = error/service code

      upTimeControl             = Operating time control
      upTimeCompHeating         = Operating time compressor heating
      upTimeCompCooling         = Operating time compressor cooling
      upTimeCompWw              = Operating time compressor warm water
      heatingStarts             = Heating control starts
      coolingStarts             = Cooling control starts
      nrgConsTotal              = Energy consumption total
      nrgConsCompTotal          = Energy consumption compressor total
      nrgConsCompHeating        = Energy consumption compressor heating
      nrgConsCompWw             = Energy consumption compressor warm water
      nrgConsCompCooling        = Energy consumption compressor cooling
      nrgSuppTotal              = Energy supplied total
      nrgSuppHeating            = Energy supplied heating
      nrgSuppWw                 = Energy supplied warm water
      nrgSuppCooling            = Energy supplied cooling
      auxElecHeatNrgConsTotal   = Auxiliary electrical heater energy consumption total
      auxElecHeatNrgConsHeating = Auxiliary electrical heater energy consumption heating
      auxElecHeatNrgConsWW      = Auxiliary electrical heater energy consumption DHW
      maintenanceMessage
      maintenanceDate
      maintenanceType
      maintenanceTime

      hpPower
      hpTc0
      hpTc1
      hpTc3
      hpTr3
      hpTr4
      hpTr5
      hpTr6
      hpTr7
      hpTl2
      hpPl1
      hpPh1
```

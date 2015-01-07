[
	/(.*init\s*\=\s*\{\sservletContext\s->)/: {destFile->//select entire line
		String linesToAdd = ""
		
		String line = "defpackage.CustomMarshallerRegistrar.registerMarshallers()"
		if(!destFile.text.contains(line)) {
			linesToAdd += "\t\t" + line + "\n"
		}
		
		String line2 = "defpackage.InternalFrontendHelper.writeConfig('angular/client/')"
		if(!destFile.text.contains(line2)) {
			linesToAdd += "\t\t" + line2 + "\n"
		}
	
		
		String line3 = "testUserGeneratorService.generate()"
		if(!destFile.text.contains(line3)) {
			linesToAdd += "\t\t" + line3 + "\n"
		}
		
		return linesToAdd
	},
	/(.*class\s*BootStrap\s*\{)/: {destFile->//select entire line
		String linesToAdd = ""
		
		String line = "def testUserGeneratorService"
		if(!destFile.text.contains(line)) {
			linesToAdd += "\t" + line + "\n"
		}
		return linesToAdd
	}
]
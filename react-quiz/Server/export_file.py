from __future__ import print_function
import httplib2
import os
import io

from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage
from apiclient import errors

from google.oauth2 import service_account

from apiclient.http import MediaFileUpload, MediaIoBaseDownload

try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

SCOPES = ['https://www.googleapis.com/auth/drive']

class FileExporter:

    #Function to format all the data stored in the google doc
    def format_data(self,data):
        
        #Split data up by each new line
        lineSplit = data.splitlines()

        lineSplit[0] = lineSplit[0][1:] #Trim first line to get rid of \ufeff

        infoTitles = [] #Array to hold title of info point
        infoContent = [] #Array to hold content of info point

        cardContent = [] #Array to hold all info points

        for i in lineSplit:
            if i[0] == "^":
                if len(infoTitles) > 0:
                    object = { 
                        "title" : infoTitles,
                        "content" : infoContent
                    }
                    cardContent.append(object)
                infoTitles = []
                infoContent = []
                infoTitles.append(i[1:])
            else:
                infoContent.append(i)

        object = { 
            "title" : infoTitles,
            "content" : infoContent
        }
        cardContent.append(object)
        return cardContent
    
    def download_file(self,service,file_id,mime_type,filepath):
        """Downloads files belonging to a folder (ignores subfolders).
        Args:
        service: Drive API service instance.
        file_id: Drive file id
        filepath: where to save the file
        """       
        file = service.files().get(fileId=file_id,fields='name').execute()
        filepath = filepath + file.get('name')

        request = service.files().export(fileId=file_id, mimeType=mime_type)
        
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print("Download %d%%." % int(status.progress() * 100))

        data = fh.getvalue()
        string = data.decode("utf-8") 
        
        info_points = self.format_data(string)

        return info_points
            

   
    def init(self):
        SERVICE_ACCOUNT_KEY = 'desqol-d6756a6f656c.json'

        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_KEY, scopes=SCOPES)
        
        service = discovery.build('drive', 'v3', credentials=credentials)
        return service
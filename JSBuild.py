#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sublime
import sublime_plugin
import os

import subprocess;

from Default.exec import ExecCommand


class ExampleCommand(sublime_plugin.TextCommand, ):
  def run(self, edit):
    self.view.insert(edit, 0, "Hello, World!")

class MochaCommand(sublime_plugin.TextCommand, ProcessListener):

  def run(self, edit):
    if os.name == "posix":
      path = "/usr/local/bin:" + os.environ['PATH']
    else:
      path = os.environ['PATH']


    self.encoding="utf-8"


    self.view.window().run_command('my_exec', {
      'cmd': 'mocha -v',
      'shell':True
    })
    # self.proc = AsyncProcess('mocha -v', None, {}, self, shell=True)


class MyExecCommand(ExecCommand):

  def on_data(self, proc, data):
      try:
          characters = data.decode(self.encoding)
      except:
          characters = "[Decode error - output not " + self.encoding + "]\n"
          proc = None

      # Normalize newlines, Sublime Text always uses a single \n separator
      # in memory.
      characters = characters.replace('\r\n', '\n').replace('\r', '\n').replace('\n', '|')

      self.append_string(proc, characters)


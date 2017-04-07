Hello, World!import sublime
import sublime_plugin


class ExampleCommand(sublime_plugin.TextCommand):
  def run(self, edit):
    self.view.insert(edit, 0, "Hello, World!")


class NpmInstallCommand(sublime_plugin.TextCommand):

  def run(self):
    self.view.window().run_command('exec', {
      'cmd': 'npm -v',
      'shell':True
    })


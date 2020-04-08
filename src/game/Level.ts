export class Level {
  name: string
  map: integer[][]
  width: integer
  height: integer
  sideHelper: integer[][]
  aboveHelper: integer[][]
  constructor(name: string, map: integer[][]) {
      this.name = name
      this.map = map
      this.height = map.length
      this.width = map[0].length
      this.sideHelper = []
      this.aboveHelper = []
      this.map.forEach(line => {
          this.sideHelper.push(this.helper(line))
      });
      for(var i=0; i < this.width; i += 1) {
          var line : integer[] = []
          for(var j=0; j < this.height; j += 1) {
              line.push(this.map[j][i])
          }
          this.aboveHelper.push(this.helper(line))
      }
  }
  
  helper(line: integer[]): integer[] {
      if (line.every( v => v == 0)) {
          return []
      }
      var count = 0
      var result: integer[] = []
      line.forEach(v => {
          if (count > 0 && v == 0) {
              result.push(count)
              count = 0
          } else if (v == 1) {
              count += 1
          }
      });
      if (count > 0) {
          result.push(count)
      }
      return result
  }
}